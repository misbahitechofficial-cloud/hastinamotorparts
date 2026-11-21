import { MetadataRoute } from 'next';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://www.hastinamotorparts.in';
  const now = new Date();

  // 1. Core High-Priority Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/enquiry`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Brand Landing Pages
  const uniqueBrands = Array.from(new Set(CATALOGUE_DB.m.map((m) => m.brandSlug)));
  const brandRoutes: MetadataRoute.Sitemap = uniqueBrands.map((brandSlug) => ({
    url: `${baseUrl}/brands/${brandSlug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dedicated Model Catalogue Pages (all 19 models)
  const modelRoutes: MetadataRoute.Sitemap = CATALOGUE_DB.m.map((m) => ({
    url: `${baseUrl}/models/${m.brandSlug}/${m.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 4. Product Category Hub Pages
  const categories = [
    'engine',
    'brake',
    'suspension',
    'electrical',
    'filters',
    'cooling',
    'transmission'
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 5. Sample Key Parts for Deep OEM Google Indexing (up to 20 parts per model)
  const partMap = new Map<number, number>();
  const sampledParts: MetadataRoute.Sitemap = [];

  for (let i = 0; i < CATALOGUE_DB.r.length; i++) {
    const row = CATALOGUE_DB.r[i];
    const mIdx = row[0];
    const count = partMap.get(mIdx) || 0;
    if (count < 20) {
      partMap.set(mIdx, count + 1);
      const m = CATALOGUE_DB.m[mIdx];
      const partNoClean = row[3].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      sampledParts.push({
        url: `${baseUrl}/part/${partNoClean}-${m.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...categoryRoutes,
    ...sampledParts,
  ];
}
