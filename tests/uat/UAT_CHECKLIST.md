# SwishOS.io — User Acceptance Testing (UAT) Checklist
**Version:** 1.0.0-dev  
**Branch:** `dev`  
**Server:** http://localhost:3000  
**Date:** 2026-07-16

---

## Sign-Off Criteria

All items marked ✅ must pass before promoting `dev → main` and deploying to production.

---

## 1. Landing Page (`/`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 1.1 | Page loads without white flash | Dark background visible immediately | ✅ |
| 1.2 | Sticky nav remains visible on scroll | Nav stays at top | ✅ |
| 1.3 | "Validate Deal" nav button goes to /b2b | Correct route | ✅ |
| 1.4 | "Book a Demo" nav button goes to /contact | Correct route | ✅ |
| 1.5 | Hero heading renders with gradient text | Blue/violet gradient on "in a blink" | ✅ |
| 1.6 | Dashboard mock shows live shipments | Rotterdam, Dubai routes visible | ✅ |
| 1.7 | SwishOS product section renders phone mockup | Phone frame with cart visible | ✅ |
| 1.8 | Feature grid shows 6 cards | All 6 icons + descriptions | ✅ |
| 1.9 | Metrics show 70%, <15min, 2×, 24/7 | Gradient numbers render | ✅ |
| 1.10 | "How it works" shows 4 numbered steps | 01–04 visible | ✅ |
| 1.11 | Regions section shows EU and Middle East | Two region cards | ✅ |
| 1.12 | CTA section gradient glow renders | Radial glow at top of card | ✅ |
| 1.13 | Footer has all links and copyright | © 2026 SwishOS | ✅ |
| 1.14 | Mobile viewport: nav collapses | No overflow on 390px width | ✅ |

---

## 2. Deal Validator (`/b2b`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 2.1 | Page loads with correct heading | "Deal Validator" visible | ✅ |
| 2.2 | All 6 form inputs render correctly | company, sector, volume, basket, distances, times | ✅ |
| 2.3 | Empty state shows "Awaiting Input Parameters" | Placeholder visible | ✅ |
| 2.4 | Entering volume + basket triggers ROI calculation | Results panel populates | ✅ |
| 2.5 | Supermarket sector → recommends SwishOS | Green badge with SwishOS | ✅ |
| 2.6 | Distributor sector with >50k volume → B2B OS | B2B OS recommendation | ✅ |
| 2.7 | Compatibility score shows as percentage | e.g. "97%" | ✅ |
| 2.8 | Monthly savings shows dollar amount | e.g. "$12,000/mo" | ✅ |
| 2.9 | Recharts bar chart renders without hydration error | No SSR mismatch in console | ✅ |
| 2.10 | "Contact Us" button links to /contact with params | URL includes savings, app, score | ✅ |
| 2.11 | Back link returns to / | Correct navigation | ✅ |
| 2.12 | min=1 on number inputs prevents negative values | Browser blocks or ignores negatives | ✅ |

---

## 3. SwishOS Q-Commerce Showcase (`/qcommerce`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 3.1 | Phone frame renders with status bar | 09:41 and 5G badge visible | ✅ |
| 3.2 | Product grid loads with all products | ≥12 product cards | ✅ |
| 3.3 | Search input filters products in real time | Typing "milk" filters correctly | ✅ |
| 3.4 | Category pills filter by category | Clicking "Dairy" shows dairy items | ✅ |
| 3.5 | Add to cart triggers success toast | "Added to cart" toast appears | ✅ |
| 3.6 | Floating cart bar appears after adding item | Green bar slides up from bottom | ✅ |
| 3.7 | Cart counter badge shows correct count | Badge updates on each add | ✅ |
| 3.8 | Cart sheet opens with item list | Sheet slides up with Swish Cart title | ✅ |
| 3.9 | Quantity +/- buttons work in cart | Count increments/decrements | ✅ |
| 3.10 | "Confirm & Place Order" triggers tracking view | Dispatch stepper appears | ✅ |
| 3.11 | Stepper auto-advances every ~7s | Steps 1→5 animate progressively | ✅ |
| 3.12 | Toast notifications fire at each step | Info toasts with step names | ✅ |
| 3.13 | "Reset and Browse Again" returns to grid | Product grid reappears | ✅ |
| 3.14 | No console errors during full flow | Clean browser console | ✅ |

---

## 4. Contact / Deal Proposal (`/contact`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 4.1 | Form card renders with all fields | Name, Company, Email, Phone, App, Message | ✅ |
| 4.2 | URL params pre-populate company and message | Visit /contact?company=X&app=swishos → pre-filled | ✅ |
| 4.3 | Empty submit shows validation errors | Zod error messages appear | ✅ |
| 4.4 | Invalid email shows format error | "Invalid email" message | ✅ |
| 4.5 | Valid submission shows success toast | "Proposal sent" or similar toast | ✅ |
| 4.6 | "B2B Logistics OS" option selectable | Dropdown has correct options | ✅ |
| 4.7 | Back link goes to / | Correct navigation | ✅ |
| 4.8 | Footer shows © 2026 SwishOS | Correct copyright | ✅ |

---

## 5. 404 & Error Pages

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 5.1 | /nonexistent shows custom 404 | Gradient "404" and "Page not found" | ✅ |
| 5.2 | "Back to SwishOS" link on 404 goes to / | Correct navigation | ✅ |
| 5.3 | "Open Deal Validator" on 404 goes to /b2b | Correct navigation | ✅ |
| 5.4 | 404 page has dark background | No white flash | ✅ |

---

## 6. SEO & Performance

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 6.1 | /sitemap.xml returns 200 and contains all routes | 4 routes listed | ✅ |
| 6.2 | /robots.txt returns 200 with correct sitemap URL | swishos.io/sitemap.xml | ✅ |
| 6.3 | All pages have og:title and og:description | Meta tags in `<head>` | ✅ |
| 6.4 | Twitter card type is summary_large_image | twitter:card meta present | ✅ |
| 6.5 | theme-color is dark (#06070c) | meta[name="theme-color"] | ✅ |
| 6.6 | npm run build completes with 0 errors | All 6 routes statically generated | ✅ |

---

## 7. Accessibility

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 7.1 | All form inputs have labels linked via htmlFor/id | ARIA-correct | ✅ |
| 7.2 | All select elements have aria-label | Screen-reader accessible | ✅ |
| 7.3 | Decorative icons have aria-hidden="true" | ARIA pollution removed | ✅ |
| 7.4 | Awaiting panel has role="status" | ARIA live region | ✅ |
| 7.5 | scroll-margin-top set for anchor links | Sticky nav offset correct | ✅ |

---

## Sign-Off

| Reviewer | Role | Date | Signature |
|----------|------|------|-----------|
| | Lead Developer | 2026-07-16 | |
| | QA Engineer | 2026-07-16 | |
| | Product Owner | 2026-07-16 | |

**Decision:** ☐ APPROVED for production deploy  ☐ BLOCKED — see failed items above
