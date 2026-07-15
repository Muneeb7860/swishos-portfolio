# Draviqo Portfolio — Next.js App

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-org%2Fportfolio)

The official Draviqo portfolio and product showcase — built with **Next.js 16 (App Router)** and deployed to **Vercel**.

---

## What's inside

| Route | Purpose |
|-------|---------|
| `/` | Brand landing page — hero, SwishOS showcase, B2B OS sections, metrics, regions, CTA |
| `/b2b` | **Deal Validator** — live ROI calculator + OS recommendation engine |
| `/qcommerce` | **SwishOS live demo** — mobile-framed product grid, cart, checkout, dispatch stepper |
| `/contact` | Deal proposal form — pre-populated from Deal Validator via URL params |

---

## Tech stack

- **Next.js 16** (Turbopack, App Router, static generation)
- **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** components
- **Recharts** — ROI bar chart (with hydration guard)
- **Sonner** — toast notifications
- **Zod** — contact form validation
- **Lucide React** — icons

---

## Getting started

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

---

## Project structure

```
src/
├── app/
│   ├── (marketing)/        # Landing page + its loading.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── b2b/                # Deal Validator route
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── qcommerce/          # SwishOS showcase route
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── contact/            # Deal proposal form
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # Custom 404 page
│   ├── layout.tsx          # Root layout (OG metadata, Toaster)
│   ├── globals.css         # Sora font, Tailwind v4, utilities
│   └── sitemap.ts          # Auto-generated /sitemap.xml
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── ErrorBoundary.tsx   # Client-side error boundary wrapper
├── features/
│   ├── b2b/Dashboard.tsx   # Deal Validator business logic + Recharts
│   └── qcommerce/          # SwishOS product grid + cart + stepper
│       └── ProductGrid.tsx
└── lib/
    ├── mock.ts             # Zod-validated mock data (orders, products)
    └── utils.ts            # cn() utility
```

---

## Deployment

### Vercel (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `portfolio` GitHub repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Set your custom domain under **Settings → Domains**

The `vercel.json` in root sets the region to `bom1` (Mumbai) for lowest latency to the primary audience.

### Environment variables

No server-side environment variables are required — the app is fully static. When you wire up a real contact form backend (e.g. Resend), add:

```
RESEND_API_KEY=re_...
```

---

## Old static site (draviqo.org on Netlify)

The legacy static site lives in `../draviqo/`. When the new domain is ready:

1. Deploy this Next.js app to Vercel with the new domain
2. Open `../draviqo/netlify.toml` and uncomment the **MIGRATION** block
3. Replace `YOUR_NEW_DOMAIN.com` with the actual domain
4. Push to the `draviqo` repo — Netlify will 301-redirect all old traffic automatically

---

## License

© 2026 Draviqo. All rights reserved.
