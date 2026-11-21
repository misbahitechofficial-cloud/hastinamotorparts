import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { slugify } from '../../utils/slugify';

const router = Router();

// Public: Get all active brands
router.get('/', (req, res) => {
  const vehicleType = req.query.vehicleType as string;
  const brands = store.getBrands(vehicleType);
  return res.json({ success: true, brands });
});

// Public: Get models for a brand
router.get('/:slug/models', (req, res) => {
  const vehicleType = req.query.vehicleType as string;
  const data = store.getModelsByBrandSlug(req.params.slug, vehicleType);
  if (!data) {
    return res.status(404).json({ success: false, error: 'Brand not found' });
  }
  return res.json({ success: true, ...data });
});

// Admin: Get all brands (including inactive)
router.get('/admin', requireAuth, (req, res) => {
  return res.json({ success: true, brands: store.brands });
});

const brandSchema = z.object({
  name: z.string().min(2),
  types: z.array(z.enum(['MOTORCYCLE', 'SCOOTER', 'TUKTUK', 'CAR'])),
  logoUrl: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true)
});

// Admin: Create brand
router.post('/admin', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const data = brandSchema.parse(req.body);
    const slug = slugify(data.name);

    if (store.brands.some(b => b.slug === slug)) {
      return res.status(400).json({ success: false, error: 'A brand with this name already exists' });
    }

    const newBrand = {
      id: Math.max(...store.brands.map(b => b.id), 0) + 1,
      name: data.name,
      slug,
      types: data.types,
      logoUrl: data.logoUrl,
      sortOrder: data.sortOrder,
      isActive: data.isActive
    };

    store.brands.push(newBrand);
    return res.status(201).json({ success: true, brand: newBrand });
  } catch (err) {
    next(err);
  }
});

// Admin: Update brand
router.put('/admin/:id', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const brand = store.brands.find(b => b.id === id);
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const data = brandSchema.partial().parse(req.body);
    if (data.name) {
      brand.name = data.name;
      brand.slug = slugify(data.name);
    }
    if (data.types) brand.types = data.types;
    if (data.logoUrl !== undefined) brand.logoUrl = data.logoUrl;
    if (data.sortOrder !== undefined) brand.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) brand.isActive = data.isActive;

    return res.json({ success: true, brand });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete brand
router.delete('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = store.brands.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Brand not found' });
  }
  store.brands.splice(idx, 1);
  return res.json({ success: true, message: 'Brand deleted successfully' });
});

export default router;
