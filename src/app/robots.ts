import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Legacy quick-commerce routes that should not be indexed.
      disallow: ['/api/', '/en/login', '/en/signup', '/ar/login', '/ar/signup', '/en/roi', '/ar/roi'],
    },
    sitemap: 'https://swishos.io/sitemap.xml',
  };
}
