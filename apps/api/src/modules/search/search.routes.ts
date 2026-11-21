import { Router } from 'express';
import { store } from '../../store';
import { normalizePartNo } from '../../utils/normalizePartNo';
import { createRateLimiter } from '../../middleware/rateLimit';

const router = Router();

// Public: Autocomplete suggestions
router.get('/suggest', (req, res) => {
  const q = ((req.query.q as string) || '').trim();
  if (!q || q.length < 2) {
    return res.json({
      success: true,
      suggestions: {
        parts: [],
        models: [],
        categories: []
      }
    });
  }

  const normQuery = normalizePartNo(q);
  const lowerQuery = q.toLowerCase();

  // Match parts
  const matchedParts = store.parts
    .filter(p => {
      if (normalizePartNo(p.partNumber).includes(normQuery)) return true;
      if (p.altNumbers.some(alt => normalizePartNo(alt).includes(normQuery))) return true;
      if (p.name.toLowerCase().includes(lowerQuery)) return true;
      return false;
    })
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      partNumber: p.partNumber,
      name: p.name,
      slug: p.slug,
      grade: p.grade,
      imageUrl: p.images[0] || null
    }));

  // Match vehicle models
  const matchedModels = store.models
    .filter(m => m.name.toLowerCase().includes(lowerQuery) || m.slug.includes(lowerQuery))
    .slice(0, 3)
    .map(m => {
      const brand = store.brands.find(b => b.id === m.brandId);
      return {
        id: m.id,
        name: m.name,
        slug: m.slug,
        brandName: brand?.name || '',
        brandSlug: brand?.slug || '',
        type: m.type
      };
    });

  // Match categories
  const matchedCategories = store.categories
    .filter(c => c.name.toLowerCase().includes(lowerQuery) && c.isActive)
    .slice(0, 3)
    .map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      level: c.level
    }));

  return res.json({
    success: true,
    suggestions: {
      parts: matchedParts,
      models: matchedModels,
      categories: matchedCategories
    }
  });
});

// Public: Full Search with Search Logging
router.get('/', createRateLimiter(60000, 100), (req, res) => {
  const q = ((req.query.q as string) || '').trim();
  const brand = req.query.brand as string;
  const model = req.query.model as string;
  const category = req.query.category as string;
  const grade = req.query.grade as string;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 24;

  const result = store.getParts({
    q,
    brandSlug: brand,
    modelSlug: model,
    categorySlug: category,
    grade,
    page,
    limit
  });

  // Log search analytics if query was provided
  if (q) {
    const country = (req.headers['cf-ipcountry'] as string) || (req.query.country as string) || undefined;
    store.logSearch(q, result.total, country);
  }

  return res.json({
    success: true,
    query: q,
    ...result
  });
});

export default router;
