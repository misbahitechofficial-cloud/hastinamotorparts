import { MetadataRoute } from 'next';
import { SEED_BRANDS, SEED_PARTS } from '@/lib/seed-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hastinamotorparts.in';

  const staticRoutes = [
    '',
    '/about',
    '/brands',
    '/parts',
    '/markets',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/enquiry'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const brandRoutes = SEED_BRANDS.map((b) => ({
    url: `${baseUrl}/brands/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const partRoutes = SEED_PARTS.map((p) => ({
    url: `${baseUrl}/part/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...brandRoutes, ...partRoutes];
}
