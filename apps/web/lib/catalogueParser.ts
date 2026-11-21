import { CATALOGUE_DB } from './embeddedCatalogue';

export interface CatalogPartItem {
  id: string;
  name: string;
  partNumber: string;
  oemNumber: string;
  slug: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  model: {
    id: string;
    name: string;
    slug: string;
    vehicleType?: string;
  };
  compatModelSlugs?: string[];
  grade: 'OEM Genuine' | 'Tier-1 OES' | 'Export Grade';
  moq: number;
  unit: string;
  origin: string;
  imageUrl?: string;
  images?: string[];
  specifications: Record<string, string>;
  modelsCompat?: string[];
}

let cachedParts: CatalogPartItem[] | null = null;

export function getAllCatalogueParts(): CatalogPartItem[] {
  if (cachedParts && cachedParts.length > 0) {
    return cachedParts;
  }

  const parts: CatalogPartItem[] = [];
  const rows = CATALOGUE_DB.r;
  const models = CATALOGUE_DB.m;
  const categories = CATALOGUE_DB.c;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const m = models[row[0]];
    const catName = categories[row[2]] || 'General Components';
    const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const partNo = row[3];
    const desc = row[4];
    const stdQty = String(row[5] || '1');
    const refNo = String(row[6] || '');
    const imgUrl = row[7] || '/images/hero-motorcycle-showcase.png';

    const pSlug = `${partNo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${m.slug}`;

    parts.push({
      id: `${m.code}-${partNo}-${idx}`,
      name: desc,
      partNumber: partNo,
      oemNumber: partNo,
      slug: pSlug,
      description: `${desc} (Assembly: ${row[1]}${refNo ? `, Item Ref #${refNo}` : ''})`,
      category: {
        id: catSlug,
        name: catName,
        slug: catSlug
      },
      brand: {
        id: m.brandSlug,
        name: m.brand,
        slug: m.brandSlug
      },
      model: {
        id: m.slug,
        name: m.label,
        slug: m.slug,
        vehicleType: 'Two Wheeler'
      },
      compatModelSlugs: [m.slug, m.code.toLowerCase()],
      grade: 'OEM Genuine',
      moq: 1,
      unit: 'PCS',
      origin: 'India',
      imageUrl: imgUrl,
      images: [imgUrl],
      specifications: {
        'Figure Assembly': row[1],
        'Item Ref': refNo || 'N/A',
        'Standard Qty': stdQty,
        'Model': m.label,
        'Brand': m.brand
      },
      modelsCompat: [m.label]
    });
  }

  cachedParts = parts;
  console.log(`[Catalogue Loader] Loaded ${cachedParts.length} parts across ${models.length} models.`);
  return cachedParts;
}

export function searchCatalogueParts(query: string, filters: {
  brand?: string;
  model?: string;
  category?: string;
  limit?: number;
  offset?: number;
} = {}): {
  items: CatalogPartItem[];
  total: number;
} {
  const all = getAllCatalogueParts();
  const q = query.trim().toLowerCase();

  let filtered = all.filter(p => {
    // Brand filter
    if (filters.brand && filters.brand !== 'all') {
      if (p.brand.slug !== filters.brand.toLowerCase() && p.brand.name.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }

    // Model filter (supports direct slug, code, or model name)
    if (filters.model && filters.model !== 'all') {
      const target = filters.model.toLowerCase().trim();
      const directMatch = p.model.slug === target || p.model.slug.includes(target) || target.includes(p.model.slug);
      const compatMatch = p.compatModelSlugs?.some(s => s === target || s.includes(target) || target.includes(s));
      const nameMatch = p.model.name.toLowerCase().includes(target);
      if (!directMatch && !compatMatch && !nameMatch) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      const catTarget = filters.category.toLowerCase().trim();
      const slugMatch = p.category.slug === catTarget || p.category.slug.includes(catTarget);
      const nameMatch = p.category.name.toLowerCase().includes(catTarget);

      let genericMatch = false;
      if (catTarget === 'engine-parts') {
        genericMatch = /cylinder|crank|head|valve|piston|cam|engine|oil|gasket|carburetor|throttle/i.test(p.category.name);
      } else if (catTarget === 'clutch-parts') {
        genericMatch = /clutch/i.test(p.category.name);
      } else if (catTarget === 'brake-parts' || catTarget === 'brake-system') {
        genericMatch = /brake|caliper|shoe|pad|disc|master cylinder/i.test(p.category.name);
      } else if (catTarget === 'filters') {
        genericMatch = /cleaner|filter|air/i.test(p.category.name);
      } else if (catTarget === 'transmission-parts') {
        genericMatch = /transmission|belt|roller|pulley|gear|chain|sprocket|wheel/i.test(p.category.name);
      } else if (catTarget === 'electrical-parts') {
        genericMatch = /electrical|switch|wire|lamp|starter|magneto|spark|speedometer|battery/i.test(p.category.name);
      } else if (catTarget === 'body-parts') {
        genericMatch = /cover|fender|handle|frame|panel|shield|stand|muffler/i.test(p.category.name);
      }

      if (!slugMatch && !nameMatch && !genericMatch) return false;
    }

    // Search query
    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      const pn = p.partNumber.toLowerCase();
      const pnClean = pn.replace(/[^a-z0-9]/g, '');
      const name = p.name.toLowerCase();
      const cat = p.category.name.toLowerCase();
      const model = p.model.name.toLowerCase();
      const desc = p.description.toLowerCase();

      const allWordsMatch = words.every(w => {
        const wClean = w.replace(/[^a-z0-9]/g, '');
        return pn.includes(w) ||
               (wClean.length > 2 && pnClean.includes(wClean)) ||
               name.includes(w) ||
               cat.includes(w) ||
               model.includes(w) ||
               desc.includes(w);
      });

      if (!allWordsMatch) return false;
    }

    return true;
  });

  const total = filtered.length;
  const offset = filters.offset || 0;
  const limit = filters.limit || 12;
  const items = filtered.slice(offset, offset + limit);

  return { items, total };
}

export function getModelCategories(modelSlug: string): { slug: string; name: string; count: number }[] {
  const parts = getAllCatalogueParts().filter(p => {
    const target = modelSlug.toLowerCase().trim();
    return p.model.slug === target || p.compatModelSlugs?.includes(target);
  });

  const catMap = new Map<string, { slug: string; name: string; count: number }>();
  parts.forEach(p => {
    const existing = catMap.get(p.category.slug);
    if (existing) {
      existing.count += 1;
    } else {
      catMap.set(p.category.slug, {
        slug: p.category.slug,
        name: p.category.name,
        count: 1
      });
    }
  });

  return Array.from(catMap.values()).sort((a, b) => b.count - a.count);
}

export function getPartBySlugFromCatalogue(slug: string): CatalogPartItem | null {
  const all = getAllCatalogueParts();
  const normalized = slug.trim().toLowerCase();
  
  // Try exact slug
  let found = all.find(p => p.slug === normalized);
  if (found) return found;

  // Try part number match
  found = all.find(p => {
    const pnNorm = p.partNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalized.includes(pnNorm);
  });

  return found || null;
}
