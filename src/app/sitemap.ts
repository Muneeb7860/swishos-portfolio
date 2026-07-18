import type { MetadataRoute } from 'next';

const BASE = 'https://swishos.io';
const LANGS = ['en', 'ar'] as const;

// Public, indexable routes only. /login, /signup and /roi are intentionally excluded:
// login and signup are unused legacy routes, and /roi is a redirect.
const ROUTES = ['', '/features', '/pricing', '/vision', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LANGS.flatMap((lang) =>
    ROUTES.map((route) => ({
      url: `${BASE}/${lang}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );
}
