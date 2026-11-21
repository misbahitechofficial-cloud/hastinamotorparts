import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { slugify } from '../../utils/slugify';
import { parseExcelBuffer, generateTemplateWorkbook } from '../../utils/importExcel';
import { exportPartsToExcel } from '../../utils/exportExcel';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Public: Get parts listing with comprehensive filters
router.get('/', (req, res) => {
  const {
    brand,
    model,
    modelId,
    category,
    categoryId,
    grade,
    q,
    sort,
    page,
    limit,
    vehicleType,
    featured
  } = req.query;

  const result = store.getParts({
    brandSlug: brand as string,
    modelSlug: model as string,
    modelId: modelId ? Number(modelId) : undefined,
    categorySlug: category as string,
    categoryId: categoryId ? Number(categoryId) : undefined,
    grade: grade as string,
    q: q as string,
    sort: sort as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 24,
    vehicleType: vehicleType as string,
    isFeatured: featured === 'true' ? true : undefined
  });

  return res.json({ success: true, ...result });
});

// Public: Get part by slug
router.get('/:slug', (req, res) => {
  const part = store.getPartBySlug(req.params.slug);
  if (!part) {
    return res.status(404).json({ success: false, error: 'Part not found' });
  }

  // Related parts in the same category
  const relatedParts = store.parts
    .filter(p => p.id !== part.id && p.categoryId === part.categoryId && p.isActive)
    .slice(0, 4)
    .map(p => store.getPartById(p.id));

  return res.json({
    success: true,
    part,
    relatedParts
  });
});

// Admin: Get all parts
router.get('/admin/list', requireAuth, (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  const q = req.query.q as string;

  const result = store.getParts({
    q,
    page,
    limit
  });

  return res.json({ success: true, ...result });
});

const partCreateSchema = z.object({
  partNumber: z.string().min(2),
  altNumbers: z.array(z.string()).optional().default([]),
  name: z.string().min(2),
  categoryId: z.number(),
  grade: z.enum(['GENUINE', 'OES', 'AFTERMARKET']),
  description: z.string().optional().default(''),
  specs: z.record(z.any()).optional().default({}),
  weightKg: z.number().optional().default(0.5),
  moq: z.number().optional().default(1),
  isFeatured: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  fitmentModelIds: z.array(z.number()).optional().default([])
});

// Admin: Create part
router.post('/admin', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const data = partCreateSchema.parse(req.body);
    const slug = slugify(`${data.name}-${data.partNumber}`);

    if (store.parts.some(p => p.partNumber.toLowerCase() === data.partNumber.toLowerCase())) {
      return res.status(400).json({ success: false, error: `Part number ${data.partNumber} already exists` });
    }

    const created = store.createPart({
      ...data,
      slug
    });

    return res.status(201).json({ success: true, part: created });
  } catch (err) {
    next(err);
  }
});

// Admin: Update part
router.put('/admin/:id', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = partCreateSchema.partial().parse(req.body);

    const updated = store.updatePart(id, data);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Part not found' });
    }

    return res.json({ success: true, part: updated });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete part
router.delete('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.deletePart(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Part not found' });
  }
  return res.json({ success: true, message: 'Part deleted successfully' });
});

// Admin: Set fitments for part
router.put('/admin/:id/fitments', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res) => {
  const id = Number(req.params.id);
  const modelIds = req.body.modelIds as number[];

  if (!Array.isArray(modelIds)) {
    return res.status(400).json({ success: false, error: 'modelIds must be an array of integers' });
  }

  const updated = store.updatePart(id, { fitmentModelIds: modelIds });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Part not found' });
  }

  return res.json({ success: true, part: updated });
});

// Admin: Bulk Excel/CSV Import
router.post('/admin/import', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), upload.single('file'), (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ success: false, error: 'Please upload an Excel or CSV file' });
  }

  try {
    const result = parseExcelBuffer(req.file.buffer);
    return res.json({
      success: true,
      message: `Bulk import completed: ${result.importedCount} created, ${result.updatedCount} updated.`,
      result
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: `Failed to parse Excel file: ${err.message}`
    });
  }
});

// Admin: Download Excel Template
router.get('/admin/template', (req, res) => {
  const buffer = generateTemplateWorkbook();
  res.setHeader('Content-Disposition', 'attachment; filename="hastina_parts_import_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  return res.send(buffer);
});

// Admin: Export All Parts to Excel
router.get('/admin/export', requireAuth, (req, res) => {
  const buffer = exportPartsToExcel();
  res.setHeader('Content-Disposition', 'attachment; filename="hastina_parts_catalogue_export.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  return res.send(buffer);
});

export default router;
