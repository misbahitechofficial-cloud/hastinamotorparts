import { Router } from 'express';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';

const router = Router();

// Public: Get public site settings (phone, whatsapp, address, emails)
router.get('/public', (req, res) => {
  return res.json({
    success: true,
    settings: store.siteSettings
  });
});

// Admin: Get all settings
router.get('/admin', requireAuth, (req, res) => {
  return res.json({
    success: true,
    settings: store.siteSettings
  });
});

// Admin: Update site settings
router.put('/admin', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const updates = req.body;
  if (typeof updates === 'object' && updates !== null) {
    for (const [key, val] of Object.entries(updates)) {
      store.siteSettings[key] = String(val);
    }
  }
  return res.json({
    success: true,
    settings: store.siteSettings
  });
});

export default router;
