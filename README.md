# SwishOS — AI-Native B2B Supply Chain & Quick-Commerce Operating System

Official enterprise web portal and service catalog for **SwishOS** (`swishos.io`).

---

## 🚀 Overview & Key Features

SwishOS is a unified, AI-native platform for B2B supply chain, dark store operations, and quick commerce.

- **🎨 Official SwishOS Brand Identity**: Styled with official Swish Red (`#E10600`), Charcoal (`#1A1A1A`), and White (`#FFFFFF`).
- **🌐 Bilingual & RTL Support**: Full English and Arabic (`/en` and `/ar`) localization with native CSS logical properties and dynamic `dir` handling.
- **🤖 Embedded AI Assistant**: Floating SwishOS AI Agent component connected to serverless API routes with context-aware smart fallbacks.
- **💰 Interactive Pricing & ROI Estimator**:
  - Interactive **Volume Cost Estimator** slider (`/pricing`).
  - Interactive **ROI Savings Calculator** (`/roi`).
- **⚡ Vercel Serverless Architecture**:
  - `POST /api/chat` — AI agent endpoint.
  - `POST /api/contact` — Enterprise contact & early access lead capture.
- **📱 Responsive Mobile Experience**: Hamburger drawer menu powered by `framer-motion` and `lucide-react`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Vanilla CSS tokens, HSL Tailwind CSS utilities, Next Themes
- **Animations**: Framer Motion (page transitions, drawer, interactive widgets)
- **Icons**: Lucide React
- **Hosting**: Vercel Serverless Platform

---

## 📁 Repository Structure

```
swishos-portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts      # AI Agent Serverless Endpoint
│   │   │   └── contact/route.ts   # Contact & Lead Capture Endpoint
│   │   └── [lang]/
│   │       ├── page.tsx           # Swish App Hero & Flagship Catalog
│   │       ├── features/page.tsx  # Platform Features Matrix
│   │       ├── pricing/page.tsx   # Interactive Pricing & Cost Estimator
│   │       ├── roi/page.tsx       # Interactive ROI Calculator
│   │       ├── vision/page.tsx    # SwishOS Mission & Trajectory
│   │       ├── contact/page.tsx   # Enterprise Contact Form
│   │       ├── login/page.tsx     # Private Beta Client Portal
│   │       └── signup/page.tsx    # Enterprise Early Access Request
│   ├── components/                # MobileMenu, ServiceBot, ThemeToggle
│   ├── dictionaries/              # en.json & ar.json localized strings
│   └── hooks/                     # Scroll reveal & interactive hooks
├── public/                        # SwishOS Brand Kit logos & assets
├── vercel.json                    # Vercel deployment configuration
└── next.config.ts                 # Next.js configuration
```

---

## ⚙️ Development & Deployment

### Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Bundle
```bash
npm run build
```

### Environment Variables (Vercel Dashboard)
- `RESEND_API_KEY`: (Optional) Resend API key for direct email delivery.
- `CONTACT_EMAIL`: (Optional) Destination email address for leads (e.g. `hello@swishos.io`).
- `GROQ_API_KEY`: (Optional) LLM API key for AI agent responses.

---

© 2026 SwishOS. All rights reserved.
