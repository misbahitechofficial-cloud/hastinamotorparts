import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';

const router = Router();

// Public: Get page by slug
router.get('/:slug', (req, res) => {
  const page = store.pages.find(p => p.slug.toLowerCase() === req.params.slug.toLowerCase());
  if (!page) {
    return res.status(404).json({ success: false, error: 'Page not found' });
  }
  return res.json({ success: true, page });
});

// Admin: Get all static pages
router.get('/admin/list', requireAuth, (req, res) => {
  return res.json({ success: true, pages: store.pages });
});

// Admin: Update page
router.put('/admin/:slug', requireAuth, requireRole('SUPER_ADMIN'), (req, res, next) => {
  try {
    const page = store.pages.find(p => p.slug.toLowerCase() === req.params.slug.toLowerCase());
    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    const { title, body } = req.body;
    if (title) page.title = title;
    if (body) page.body = body;
    page.updatedAt = new Date();

    return res.json({ success: true, page });
  } catch (err) {
    next(err);
  }
});

export default router;
