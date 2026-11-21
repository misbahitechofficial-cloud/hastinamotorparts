import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { slugify } from '../../utils/slugify';

const router = Router();

// Public: Get 3-level category tree for mega menu
router.get('/tree', (req, res) => {
  const tree = store.getCategoryTree();
  return res.json({ success: true, tree });
});

// Public: Flat categories list
router.get('/', (req, res) => {
  const level = req.query.level ? Number(req.query.level) : undefined;
  let list = store.categories.filter(c => c.isActive);
  if (level) {
    list = list.filter(c => c.level === level);
  }
  return res.json({ success: true, categories: list });
});

// Admin: Get all categories
router.get('/admin', requireAuth, (req, res) => {
  return res.json({ success: true, categories: store.categories });
});

const categorySchema = z.object({
  name: z.string().min(2),
  parentId: z.number().nullable().optional(),
  level: z.number().min(1).max(3),
  imageUrl: z.string().optional(),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true)
});

// Admin: Create category
router.post('/admin', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const slug = slugify(data.name);

    const newCategory = {
      id: Math.max(...store.categories.map(c => c.id), 0) + 1,
      name: data.name,
      slug,
      parentId: data.parentId || undefined,
      level: data.level,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder,
      isActive: data.isActive
    };

    store.categories.push(newCategory);
    return res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    next(err);
  }
});

// Admin: Update category
router.put('/admin/:id', requireAuth, requireRole('SUPER_ADMIN', 'CATALOGUE'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const category = store.categories.find(c => c.id === id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const data = categorySchema.partial().parse(req.body);
    if (data.name) {
      category.name = data.name;
      category.slug = slugify(data.name);
    }
    if (data.parentId !== undefined) category.parentId = data.parentId || undefined;
    if (data.level !== undefined) category.level = data.level;
    if (data.imageUrl !== undefined) category.imageUrl = data.imageUrl;
    if (data.sortOrder !== undefined) category.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    return res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete category
router.delete('/admin/:id', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const idx = store.categories.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  store.categories.splice(idx, 1);
  return res.json({ success: true, message: 'Category deleted successfully' });
});

export default router;
