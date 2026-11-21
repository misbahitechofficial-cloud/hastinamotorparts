import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { slugify } from '../../utils/slugify';

const router = Router();

// Public: Get all models (with optional brand or vehicleType filter)
router.get('/', (req, res) => {
  const brandSlug = req.query.brand as string;
  const vehicleType = req.query.vehicleType as string;

  let list = store.models.filter(m => m.isActive);

  if (brandSlug) {
    const brand = store.brands.find(b => b.slug.toLowerCase() === brandSlug.toLowerCase());
    if (brand) {
      list = list.filter(m => m.brandId === brand.id);
    }
  }

  if (vehicleType) {
    list = list.filter(m => m.type.toUpperCase() === vehicleType.toUpperCase());
  }

  const enriched = list.map(m => {
    const brand = store.brands.find(b => b.id === m.brandId);
    return {
      ...m,
      brandName: brand?.name || 'Unknown',
      brandSlug: brand?.slug || ''
    };
  });

  return res.json({ success: true, models: enriched });
});

// Admin: Get all models
router.get('/admin', requireAuth, (req, res) => {
  const enriched = store.models.map(m => {
    const brand = store.brands.find(b => b.id === m.brandId);
    return {
      ...m,
      brandName: brand?.name || 'Unknown',
      brandSlug: brand?.slug || ''
    };
  });
  return res.json({ success: true, models: enriched });
});

const modelSchema = z.object({
  brandId: z.number(),
  name: z.string().min(2),
  type: z.enum(['MOTORCYCLE', 'SCOOTER', 'TUKTUK', 'CAR']),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional().default(true)
});

// Admin: Create model
router.post('/admin', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const data = modelSchema.parse(req.body);
    const slug = slugify(data.name);

    const newModel = {
      id: Math.max(...store.models.map(m => m.id), 0) + 1,
      brandId: data.brandId,
      name: data.name,
      slug,
      type: data.type,
      yearFrom: data.yearFrom,
      yearTo: data.yearTo,
      imageUrl: data.imageUrl,
      isActive: data.isActive
    };

    store.models.push(newModel);
    return res.status(201).json({ success: true, model: newModel });
  } catch (err) {
    next(err);
  }
});

// Admin: Update model
router.put('/admin/:id', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const model = store.models.find(m => m.id === id);
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }

    const data = modelSchema.partial().parse(req.body);
    if (data.name) {
      model.name = data.name;
      model.slug = slugify(data.name);
    }
    if (data.brandId) model.brandId = data.brandId;
    if (data.type) model.type = data.type;
    if (data.yearFrom !== undefined) model.yearFrom = data.yearFrom;
    if (data.yearTo !== undefined) model.yearTo = data.yearTo;
    if (data.imageUrl !== undefined) model.imageUrl = data.imageUrl;
    if (data.isActive !== undefined) model.isActive = data.isActive;

    return res.json({ success: true, model });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete model
router.delete('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = store.models.findIndex(m => m.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Model not found' });
  }
  store.models.splice(idx, 1);
  return res.json({ success: true, message: 'Model deleted successfully' });
});

export default router;
