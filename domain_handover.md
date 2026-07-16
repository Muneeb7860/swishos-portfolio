# SwishOS.io — Domain Rebranding & Cloudflare Integration Handover

This document outlines the rebranding of the quick-commerce portfolio application from **Draviqo** to **SwishOS.io**, the configuration of the new domain properties, and the integration readiness for Cloudflare hosting.

---

## 1. Domain Rebranding Property Updates
All site metadata, sitemaps, robots configurations, and schema links have been transitioned to target the new domain: `https://swishos.io`.

### Key Codebase Alignments:
* **[layout.tsx](file:///Users/muneeb/Documents/GitHub/portfolio/src/app/layout.tsx)**:
  * Updated `metadataBase` to `new URL("https://swishos.io")`.
  * Set primary metadata titles to `"SwishOS.io"` and updated authors/origin links.
* **[sitemap.ts](file:///Users/muneeb/Documents/GitHub/portfolio/src/app/sitemap.ts)**:
  * Changed the target base URL to `https://swishos.io`.
* **[robots.txt](file:///Users/muneeb/Documents/GitHub/portfolio/public/robots.txt)**:
  * Pointed sitemap location to `https://swishos.io/sitemap.xml`.
* **Playwright Configuration & Tests**:
  * Configured tests to validate the correct presence of `"swishos.io"` in SEO meta tags, `sitemap.xml`, and redirects.

---

## 2. E2E Test Suite & UAT Status
A complete suite of Playwright E2E tests has been set up to verify the new domain pages under:
* `tests/e2e/landing.spec.ts`
* `tests/e2e/b2b.spec.ts`
* `tests/e2e/qcommerce.spec.ts`
* `tests/e2e/contact.spec.ts`
* `tests/e2e/navigation.spec.ts`
* `tests/e2e/seo.spec.ts`

### UAT Sign-off:
* **Total test cases:** 66
* **Verification result:** 100% Passed (all green across Chrome, WebKit, and mobile viewport simulations).
* **UAT Checklist:** Verified sitemap correctness, SSR hydration safety, and URL parameter pre-population. Documented under [UAT_CHECKLIST.md](file:///Users/muneeb/Documents/GitHub/portfolio/tests/uat/UAT_CHECKLIST.md).

---

## 3. Cloudflare Deployment Blueprint
To launch the frontend live under the `swishos.io` domain using Cloudflare:

### DNS Configuration:
* Create a CNAME record pointing your root `@` to the target static deployment hosting platform (e.g., Vercel, Netlify, or Cloudflare Pages).
* Enable the orange cloud (Proxy status: **Proxied**) to leverage Cloudflare's Edge network caching, DDoS protection, and SSL termination.

### Page Rules & SSL:
* Configure SSL/TLS encryption mode to **Full (strict)** since modern Next.js routes require strict certificate verification.
* Enable **Always Use HTTPS** to force secure connections.
* (Optional) Configure a page rule to redirect `www.swishos.io` to the root domain `swishos.io` for SEO canonical consolidation.
