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

export function formatCatalogueRow(idx: number): CatalogPartItem {
  const row = CATALOGUE_DB.r[idx];
  const m = CATALOGUE_DB.m[row[0]];
  const catName = CATALOGUE_DB.c[row[2]] || 'General Components';
  const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const partNo = row[3];
  const desc = row[4];
  const stdQty = String(row[5] || '1');
  const refNo = String(row[6] || '');
  const imgUrl = row[7] || '/images/hero-motorcycle-showcase.png';

  const pSlug = `${partNo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${m.slug}`;

  return {
    id: `${m.code}-${partNo}-${idx}`,
    name: desc,
    partNumber: partNo,
    oemNumber: partNo,
    slug: pSlug,
    description: `${desc} (Assembly: ${row[1]}${refNo ? `, Item Ref #${refNo}` : ''})`,
    category: {
      id: catSlug,
      name: catName,
      slug: catSlug,
    },
    brand: {
      id: m.brandSlug,
      name: m.brand,
      slug: m.brandSlug,
    },
    model: {
      id: m.slug,
      name: m.label,
      slug: m.slug,
      vehicleType: 'Two Wheeler',
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
      'Brand': m.brand,
    },
    modelsCompat: [m.label],
  };
}

let cachedParts: CatalogPartItem[] | null = null;

export function getAllCatalogueParts(): CatalogPartItem[] {
  if (cachedParts && cachedParts.length > 0) {
    return cachedParts;
  }
  const parts: CatalogPartItem[] = [];
  for (let idx = 0; idx < CATALOGUE_DB.r.length; idx++) {
    parts.push(formatCatalogueRow(idx));
  }
  cachedParts = parts;
  return cachedParts;
}

export function searchCatalogueParts(
  query: string,
  filters: {
    brand?: string;
    model?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}
): {
  items: CatalogPartItem[];
  total: number;
} {
  const rows = CATALOGUE_DB.r;
  const models = CATALOGUE_DB.m;
  const categories = CATALOGUE_DB.c;

  const q = query.trim().toLowerCase();
  const words = q ? q.split(/\s+/).filter(Boolean) : [];

  const brandFilter = filters.brand && filters.brand !== 'all' ? filters.brand.toLowerCase() : null;
  const modelFilter = filters.model && filters.model !== 'all' ? filters.model.toLowerCase() : null;
  const catFilter = filters.category && filters.category !== 'all' ? filters.category.toLowerCase() : null;

  const matchedIndices: number[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const m = models[row[0]];
    const catName = categories[row[2]] || '';

    // Brand filter
    if (brandFilter) {
      if (m.brandSlug !== brandFilter && m.brand.toLowerCase() !== brandFilter) {
        continue;
      }
    }

    // Model filter
    if (modelFilter) {
      const slugMatch = m.slug === modelFilter || m.slug.includes(modelFilter) || modelFilter.includes(m.slug);
      const codeMatch = m.code.toLowerCase() === modelFilter;
      const labelMatch = m.label.toLowerCase().includes(modelFilter);
      if (!slugMatch && !codeMatch && !labelMatch) {
        continue;
      }
    }

    // Category filter
    if (catFilter) {
      const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const directMatch = catSlug === catFilter || catSlug.includes(catFilter) || catName.toLowerCase().includes(catFilter);

      let genericMatch = false;
      if (catFilter === 'engine' || catFilter === 'engine-parts') {
        genericMatch = /cylinder|crank|head|valve|piston|cam|engine|oil|gasket|carburetor|throttle/i.test(catName);
      } else if (catFilter === 'clutch' || catFilter === 'clutch-parts') {
        genericMatch = /clutch/i.test(catName);
      } else if (catFilter === 'brake' || catFilter === 'brake-parts' || catFilter === 'brake-system') {
        genericMatch = /brake|caliper|shoe|pad|disc|master cylinder/i.test(catName);
      } else if (catFilter === 'filters') {
        genericMatch = /cleaner|filter|air/i.test(catName);
      } else if (catFilter === 'transmission' || catFilter === 'transmission-parts') {
        genericMatch = /transmission|belt|roller|pulley|gear|chain|sprocket|wheel/i.test(catName);
      } else if (catFilter === 'electrical' || catFilter === 'electrical-parts') {
        genericMatch = /electrical|switch|wire|lamp|starter|magneto|spark|speedometer|battery/i.test(catName);
      } else if (catFilter === 'suspension') {
        genericMatch = /shock|absorber|fork|suspension|steering|damper/i.test(catName);
      } else if (catFilter === 'body-parts') {
        genericMatch = /cover|fender|handle|frame|panel|shield|stand|muffler/i.test(catName);
      }

      if (!directMatch && !genericMatch) {
        continue;
      }
    }

    // Search query words
    if (words.length > 0) {
      const pn = row[3].toLowerCase();
      const pnClean = pn.replace(/[^a-z0-9]/g, '');
      const desc = row[4].toLowerCase();
      const fig = row[1].toLowerCase();
      const modelLabel = m.label.toLowerCase();

      const allMatch = words.every((w) => {
        const wClean = w.replace(/[^a-z0-9]/g, '');
        return (
          pn.includes(w) ||
          (wClean.length > 2 && pnClean.includes(wClean)) ||
          desc.includes(w) ||
          catName.toLowerCase().includes(w) ||
          modelLabel.includes(w) ||
          fig.includes(w)
        );
      });

      if (!allMatch) {
        continue;
      }
    }

    matchedIndices.push(idx);
  }

  const total = matchedIndices.length;
  const offset = filters.offset || 0;
  const limit = filters.limit || 12;
  const slice = matchedIndices.slice(offset, offset + limit);

  const items = slice.map((idx) => formatCatalogueRow(idx));

  return { items, total };
}

export function getModelCategories(modelSlug: string): { slug: string; name: string; count: number }[] {
  const rows = CATALOGUE_DB.r;
  const models = CATALOGUE_DB.m;
  const categories = CATALOGUE_DB.c;

  const target = modelSlug.toLowerCase().trim();
  const catCounts = new Map<number, number>();

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const m = models[row[0]];
    if (m.slug === target || m.code.toLowerCase() === target || m.slug.includes(target)) {
      const cIdx = row[2];
      catCounts.set(cIdx, (catCounts.get(cIdx) || 0) + 1);
    }
  }

  const result: { slug: string; name: string; count: number }[] = [];
  catCounts.forEach((count, cIdx) => {
    const name = categories[cIdx] || 'General';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    result.push({ slug, name, count });
  });

  return result.sort((a, b) => b.count - a.count);
}

export function getPartBySlugFromCatalogue(slug: string): CatalogPartItem | null {
  const normalized = slug.trim().toLowerCase();
  const rows = CATALOGUE_DB.r;
  const models = CATALOGUE_DB.m;

  // 1. First attempt: match by constructed slug
  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const m = models[row[0]];
    const partNo = row[3];
    const pSlug = `${partNo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${m.slug}`;
    if (pSlug === normalized) {
      return formatCatalogueRow(idx);
    }
  }

  // 2. Second attempt: match by raw part number
  const cleanTarget = normalized.replace(/[^a-z0-9]/g, '');
  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const pnClean = row[3].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (pnClean.length > 3 && (cleanTarget === pnClean || cleanTarget.includes(pnClean) || pnClean.includes(cleanTarget))) {
      return formatCatalogueRow(idx);
    }
  }

  return null;
}

export function getRelatedPartsFromCatalogue(partSlug: string, limit: number = 4): CatalogPartItem[] {
  const target = getPartBySlugFromCatalogue(partSlug);
  if (!target) return [];

  const rows = CATALOGUE_DB.r;
  const models = CATALOGUE_DB.m;
  const related: CatalogPartItem[] = [];

  for (let idx = 0; idx < rows.length && related.length < limit; idx++) {
    const row = rows[idx];
    const m = models[row[0]];
    if (m.slug === target.model.slug && row[3] !== target.partNumber) {
      related.push(formatCatalogueRow(idx));
    }
  }

  return related;
}
