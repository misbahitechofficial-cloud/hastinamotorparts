import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://www.hastinamotorparts.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/auth'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/auth'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/diagrams/', '/favicon.svg', '/hastina-logo.svg', '/hastina-icon.svg'],
        disallow: ['/admin'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/auth'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
