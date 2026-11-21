import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { createRateLimiter } from '../../middleware/rateLimit';
import { exportEnquiriesToExcel } from '../../utils/exportExcel';

const router = Router();

const enquiryItemSchema = z.object({
  partId: z.number().optional(),
  partNumber: z.string().min(1),
  partName: z.string().optional(),
  quantity: z.number().min(1).default(1)
});

const createEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional(),
  message: z.string().optional(),
  attachmentUrl: z.string().optional(),
  items: z.array(enquiryItemSchema).min(1, 'At least one part is required in the enquiry list')
});

// Public: Submit quotation enquiry
router.post('/', createRateLimiter(60000, 15, 'Too many quotation requests submitted. Please wait a moment.'), async (req, res, next) => {
  try {
    const data = createEnquirySchema.parse(req.body);

    const enquiry = store.createEnquiry(data);

    // Simulation / log of outgoing emails
    console.log(`[EMAIL DISPATCH] Ref: ${enquiry.refNo}`);
    console.log(`  -> Confirmation sent to buyer: ${enquiry.email}`);
    console.log(`  -> Alert sent to sales desk: sales@hastinamotorparts.com`);
    console.log(`  -> Items count: ${enquiry.items.length}`);

    return res.status(201).json({
      success: true,
      refNo: enquiry.refNo,
      enquiry,
      message: 'Your enquiry has been received. Our export sales team will send a competitive quotation within 24 hours.'
    });
  } catch (err) {
    next(err);
  }
});

// Admin: Get all enquiries
router.get('/admin', requireAuth, (req, res) => {
  const { status, search, country } = req.query;
  const enquiries = store.getEnquiries({
    status: status as string,
    search: search as string,
    country: country as string
  });
  return res.json({ success: true, enquiries });
});

// Admin: Get single enquiry
router.get('/admin/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const enquiry = store.enquiries.find(e => e.id === id);
  if (!enquiry) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }
  return res.json({ success: true, enquiry });
});

// Admin: Update enquiry status or notes
router.patch('/admin/:id', requireAuth, requireRole('SUPER_ADMIN', 'SALES'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status, notes, assignedTo } = req.body;

    const updated = store.updateEnquiryStatus(id, status, notes, assignedTo);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }

    return res.json({ success: true, enquiry: updated });
  } catch (err) {
    next(err);
  }
});

// Admin: Send email reply to customer
router.post('/admin/:id/reply', requireAuth, requireRole('SUPER_ADMIN', 'SALES'), (req, res) => {
  const id = Number(req.params.id);
  const enquiry = store.enquiries.find(e => e.id === id);
  if (!enquiry) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  const { subject, message, quotedAmount, currency } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message body is required' });
  }

  // Update status to QUOTED automatically
  enquiry.status = 'QUOTED';
  enquiry.notes = `${enquiry.notes || ''}\n[${new Date().toISOString().split('T')[0]}] Quotation reply sent to ${enquiry.email}`.trim();
  enquiry.updatedAt = new Date();

  console.log(`[QUOTATION EMAIL SENT] To: ${enquiry.email}, Subject: ${subject || `Quotation for ${enquiry.refNo}`}`);

  return res.json({
    success: true,
    message: `Quotation email successfully sent to ${enquiry.email}`,
    enquiry
  });
});

// Admin: Export enquiries to Excel
router.get('/admin/export', requireAuth, (req, res) => {
  const buffer = exportEnquiriesToExcel();
  res.setHeader('Content-Disposition', 'attachment; filename="hastina_enquiries_export.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  return res.send(buffer);
});

export default router;
