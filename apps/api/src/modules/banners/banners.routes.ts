import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';

const router = Router();

// Public: Get active banners
router.get('/', (req, res) => {
  const banners = store.banners.filter(b => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return res.json({ success: true, banners });
});

// Admin: Get all banners
router.get('/admin', requireAuth, (req, res) => {
  return res.json({ success: true, banners: store.banners });
});

const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1),
  link: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true)
});

// Admin: Create banner
router.post('/admin', requireAuth, requireRole('SUPER_ADMIN'), (req, res, next) => {
  try {
    const data = bannerSchema.parse(req.body);
    const newBanner = {
      id: Math.max(...store.banners.map(b => b.id), 0) + 1,
      ...data
    };
    store.banners.push(newBanner);
    return res.status(201).json({ success: true, banner: newBanner });
  } catch (err) {
    next(err);
  }
});

// Admin: Update banner
router.put('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const banner = store.banners.find(b => b.id === id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    const data = bannerSchema.partial().parse(req.body);
    Object.assign(banner, data);
    return res.json({ success: true, banner });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete banner
router.delete('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = store.banners.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Banner not found' });
  }
  store.banners.splice(idx, 1);
  return res.json({ success: true, message: 'Banner deleted successfully' });
});

export default router;
