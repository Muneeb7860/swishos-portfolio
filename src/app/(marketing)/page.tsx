import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Calculator,
  Zap,
  Compass,
  CreditCard,
  BarChart3,
  Bot,
  Plug,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Draviqo — Commerce Operating Systems & Apps",
  description:
    "Draviqo licenses custom commerce operating systems — SwishOS for quick-commerce and Draviqo B2B OS for enterprise distribution. Validate your deal in seconds.",
};

const features = [
  {
    icon: Zap,
    title: "Instant ordering",
    desc: "Retailers reorder in seconds. AI predicts demand, flags stockouts, and builds the basket before they even ask.",
  },
  {
    icon: Compass,
    title: "Smart logistics",
    desc: "Routing, loads, and delivery windows optimized in real time across borders, fleets, and third-party carriers.",
  },
  {
    icon: CreditCard,
    title: "Built-in settlement",
    desc: "Invoicing, credit, and multi-currency payment reconciled automatically — EUR, AED, SAR and more.",
  },
  {
    icon: BarChart3,
    title: "Live visibility",
    desc: "One dashboard for every supplier, distributor, and shelf. See sell-through the moment it happens.",
  },
  {
    icon: Bot,
    title: "AI agents",
    desc: "Autonomous agents chase exceptions, resolve short-ships, and keep the network moving without a human in the loop.",
  },
  {
    icon: Plug,
    title: "Plugs into everything",
    desc: "ERP, WMS, and accounting connectors out of the box. Go live in weeks, not quarters.",
  },
];

const steps = [
  { n: "01", title: "Connect", desc: "Suppliers and distributors plug in their catalogs, stock, and pricing in minutes." },
  { n: "02", title: "Order", desc: "Retailers order through an AI-assisted storefront that predicts what they need next." },
  { n: "03", title: "Move", desc: "The OS orchestrates fulfilment, logistics, and cross-border delivery automatically." },
  { n: "04", title: "Settle", desc: "Payments, credit, and reconciliation close out with zero manual chasing." },
];

const metrics = [
  { big: "70%", label: "Less time on manual ordering" },
  { big: "<15min", label: "SwishOS local delivery target" },
  { big: "2×", label: "Faster supplier-to-shelf cycle" },
  { big: "24/7", label: "Autonomous AI operations" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#06070c] text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10%] top-[-5%] h-[50%] w-[60%] rounded-full bg-indigo-600/18 blur-[140px]" />
        <div className="absolute right-[-5%] top-[-5%] h-[55%] w-[55%] rounded-full bg-violet-600/14 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[55%] w-[60%] rounded-full bg-emerald-500/8 blur-[160px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#06070c]/60 backdrop-blur-[14px]">
        <div className="container mx-auto flex h-[68px] max-w-[1140px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
            <span className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-[0_0_24px_rgba(91,140,255,0.4)]">
              <span className="h-[11px] w-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25)]" />
            </span>
            Draviqo
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] text-slate-400 md:flex">
            <Link href="#swishos" className="transition-colors hover:text-white">SwishOS</Link>
            <Link href="#b2bos" className="transition-colors hover:text-white">B2B OS</Link>
            <Link href="#how" className="transition-colors hover:text-white">How it works</Link>
            <Link href="#regions" className="transition-colors hover:text-white">Regions</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/b2b">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 font-semibold text-white hover:bg-white/10">
                <Calculator className="mr-1.5 h-3.5 w-3.5" /> Validate Deal
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_6px_20px_rgba(91,140,255,0.35)] hover:opacity-95">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="px-6 py-24 text-center">
          <div className="container mx-auto max-w-[1140px]">
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/3 px-3.5 py-1.5 text-[13px] text-slate-400">
              <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Commerce Operating Systems &amp; Apps · by Draviqo
            </span>
            <h1 className="text-[clamp(40px,7vw,74px)] font-extrabold leading-[1.05] tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
              B2B distribution,{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#a9c0ff] via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                in a blink.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[680px] text-[clamp(17px,2.2vw,20px)] leading-relaxed text-slate-400">
              Draviqo licenses AI-native operating systems — <strong className="text-white">SwishOS</strong> for
              hyper-local quick-commerce and <strong className="text-white">Draviqo B2B OS</strong> for enterprise
              supply chains. Moving goods from supplier to shelf across the EU and the Middle East.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/b2b">
                <Button size="lg" className="h-12 bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_10px_30px_rgba(91,140,255,0.35)] hover:scale-[1.02] hover:opacity-95 transition-all">
                  Validate Your Deal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#b2bos">
                <Button size="lg" variant="outline" className="h-12 border-white/10 bg-white/4 font-semibold text-white hover:bg-white/8 hover:scale-[1.02] transition-all">
                  See the Platform
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-[15px] font-medium text-slate-400">
              <span className="flex items-center gap-2"><span className="text-emerald-400">✦</span> European Union</span>
              <span className="flex items-center gap-2"><span className="text-emerald-400">✦</span> Middle East</span>
              <span className="flex items-center gap-2"><span className="text-emerald-400">✦</span> One unified OS</span>
            </div>

            {/* Dashboard mock */}
            <div className="mx-auto mt-16 max-w-[960px] overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-b from-[#10131f] to-[#0b0e17] shadow-[0_40px_120px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
                <span className="h-[11px] w-[11px] rounded-full bg-[#2a3145]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#2a3145]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#2a3145]" />
                <span className="ml-4 text-[13px] text-slate-500">Draviqo B2B OS — Distribution control</span>
              </div>
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                <div className="rounded-[14px] border border-white/8 bg-[#141827] p-5">
                  <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[.08em] text-slate-400">Order volume — this week</p>
                  <div className="text-[30px] font-extrabold" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                    42,180 <small className="ml-2 text-[13px] font-semibold text-emerald-400">▲ 18%</small>
                  </div>
                  <div className="mt-4 flex h-[90px] items-end gap-2">
                    {[38,54,47,70,62,88,100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-[5px] bg-gradient-to-b from-indigo-500 to-violet-600/40" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-[14px] border border-white/8 bg-[#141827] p-5">
                  <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[.08em] text-slate-400">Live shipments</p>
                  {[
                    { route: "Rotterdam → Berlin", status: "On route", accent: true },
                    { route: "Dubai → Riyadh", status: "On route", accent: true },
                    { route: "Milan → Madrid", status: "Loading", accent: false },
                    { route: "Cairo → Amman", status: "Queued", accent: false },
                  ].map((s) => (
                    <div key={s.route} className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0 text-[14px]">
                      <span>{s.route}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${s.accent ? "bg-emerald-500/12 text-emerald-400" : "bg-indigo-500/12 text-indigo-400"}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SWISHOS HERO PRODUCT ── */}
        <section id="swishos" className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="grid items-center gap-12 md:grid-cols-12">
              <div className="space-y-6 md:col-span-7">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Hero Product
                </span>
                <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-tight tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                  SwishOS: Quick-Commerce Operating System
                </h2>
                <p className="text-[17px] leading-relaxed text-slate-400">
                  SwishOS connects local grocery stores and darkstores to a real-time dispatch engine. Sub-15-minute delivery, automated catalog sync, and embedded rider tracking — licensed as a complete OS to retail networks worldwide.
                </p>
                <ul className="grid gap-3">
                  {[
                    "Sub-15 minute automated dispatch router",
                    "Real-time rider GPS with temperature monitoring",
                    "Dynamic cart, catalog & search",
                    "Automated stock allocation & predictive reorder",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px]">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-emerald-400" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 pt-2">
                  <Link href="/qcommerce">
                    <Button className="bg-emerald-500 font-semibold text-white hover:bg-emerald-400">
                      Live Interactive Demo
                    </Button>
                  </Link>
                  <Link href="/b2b">
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      Estimate Licensing ROI
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Phone mockup */}
              <div className="flex justify-center md:col-span-5">
                <div className="relative h-[380px] w-[210px] overflow-hidden rounded-[36px] border border-white/10 bg-[#06070c] p-3.5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                  <div className="mx-auto mb-3 h-[14px] w-[60px] rounded-b-xl bg-black" />
                  <div className="flex h-full flex-col gap-2 rounded-[24px] border border-white/5 bg-[#10131f] p-3">
                    <span className="text-[7px] font-extrabold uppercase tracking-widest text-emerald-400">SWISHOS LIVE</span>
                    <p className="text-[10px] font-bold text-white">Downtown Darkstore #04</p>
                    <div className="flex-1 rounded-xl border border-white/5 bg-[#06070c] p-2">
                      <div className="mb-2 flex gap-1">
                        {["All","Veg","Fruit","Dairy"].map(c => (
                          <span key={c} className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${c === "All" ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400"}`}>{c}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {["Avocado $2.89","Bananas $1.99","Milk $3.49","Eggs $4.29"].map(p => (
                          <div key={p} className="rounded-lg border border-white/5 bg-white/3 p-1.5">
                            <div className="mb-1 h-6 w-full rounded bg-white/5" />
                            <p className="text-[6px] text-slate-300">{p}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[9px]">
                      <span className="text-slate-400">2 items · Basket</span>
                      <strong className="text-white">$4.88</strong>
                    </div>
                    <div className="flex h-8 cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 text-[9px] font-bold text-white">
                      Checkout via SwishOS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="mx-auto mb-14 max-w-[640px] text-center">
              <span className="text-xs font-semibold uppercase tracking-[.1em] text-emerald-400">Why Draviqo</span>
              <h2 className="mt-3 text-[clamp(30px,4.5vw,44px)] font-extrabold tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                Distribution that thinks for itself
              </h2>
              <p className="mt-4 text-[17px] text-slate-400">Every step from supplier to shelf runs on one AI-native layer — no spreadsheets, no phone-order chaos, no blind spots.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-white/8 bg-gradient-to-b from-[#10131f] to-[#10131f]/40 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(91,140,255,0.05)]">
                  <div className="mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-[12px] border border-indigo-500/25 bg-indigo-500/12 text-indigo-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2.5 text-[19px] font-bold text-white">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── B2B OS PRODUCT ── */}
        <section id="b2bos" className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="grid items-center gap-14 md:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[.1em] text-indigo-400">The Platform</span>
                <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-extrabold leading-tight tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                  One B2B OS for the whole supply chain
                </h2>
                <p className="mt-4 text-[17px] leading-relaxed text-slate-400">
                  Draviqo B2B OS is the intelligent core connecting suppliers, distributors, and retailers on a single real-time network.
                </p>
                <ul className="mt-6 grid gap-3.5">
                  {[
                    ["Supplier catalogs & pricing", "Live SKUs, promotions, and tiered pricing synced everywhere."],
                    ["Order & fulfilment engine", "From cart to dispatch with automated allocation."],
                    ["Logistics orchestration", "Fleet, route, and carrier management in one view."],
                    ["Payments & credit", "Embedded settlement with trade-credit workflows."],
                  ].map(([title, sub]) => (
                    <li key={title} className="flex gap-3 text-[15px]">
                      <span className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] bg-emerald-500/14 text-[13px] font-bold text-emerald-400">✓</span>
                      <span><strong className="text-white">{title}</strong> <span className="text-slate-400">— {sub}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Flow visual */}
              <div className="rounded-[18px] border border-white/14 bg-gradient-to-b from-[#10131f] to-[#0b0e17] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-1.5 text-[13px] text-slate-400">
                  <span className="h-[7px] w-[7px] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  Draviqo B2B OS
                </span>
                <div className="flex flex-col gap-3">
                  {[
                    ["Supplier", "Lists stock, pricing & promotions"],
                    ["Draviqo OS", "Matches demand, allocates, routes & finances"],
                    ["Distributor", "Picks, packs & moves with optimized loads"],
                    ["Shelf", "Retailer receives, sells & reorders in a blink"],
                  ].map(([step, desc], i) => (
                    <div key={step}>
                      <div className="flex items-center gap-3.5 rounded-[12px] border border-white/8 bg-[#141827] px-4 py-3.5">
                        <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-tr from-indigo-500 to-violet-600 text-[14px] font-bold text-white" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                          {i + 1}
                        </span>
                        <span><strong className="block text-[14px] text-white">{step}</strong><small className="text-[13px] text-slate-400">{desc}</small></span>
                      </div>
                      {i < 3 && <div className="py-1 text-center text-[14px] text-slate-600">↓</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── METRICS ── */}
        <section className="border-t border-white/5 px-6 py-16">
          <div className="container mx-auto max-w-[1140px]">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {metrics.map(({ big, label }) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-gradient-to-b from-[#10131f] to-[#10131f]/30 px-5 py-8 text-center">
                  <div className="bg-gradient-to-r from-[#a9c0ff] to-emerald-400 bg-clip-text text-[clamp(32px,4vw,44px)] font-extrabold text-transparent" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                    {big}
                  </div>
                  <div className="mt-2 text-[14px] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="mx-auto mb-14 max-w-[640px] text-center">
              <span className="text-xs font-semibold uppercase tracking-[.1em] text-emerald-400">How it works</span>
              <h2 className="mt-3 text-[clamp(30px,4.5vw,44px)] font-extrabold tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                From supplier to shelf, in four moves
              </h2>
              <p className="mt-4 text-[17px] text-slate-400">Draviqo replaces a tangle of calls, PDFs, and disconnected tools with one continuous flow.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="rounded-2xl border border-white/8 bg-[#10131f] p-7">
                  <div className="mb-5 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-white/14 text-[15px] font-bold text-indigo-400" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                    {n}
                  </div>
                  <h3 className="mb-2 text-[17px] font-bold text-white">{title}</h3>
                  <p className="text-[14px] leading-relaxed text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REGIONS ── */}
        <section id="regions" className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="mx-auto mb-14 max-w-[640px] text-center">
              <span className="text-xs font-semibold uppercase tracking-[.1em] text-emerald-400">Where we operate</span>
              <h2 className="mt-3 text-[clamp(30px,4.5vw,44px)] font-extrabold tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                Built for two of the world's fastest-moving markets
              </h2>
              <p className="mt-4 text-[17px] text-slate-400">One platform, tuned for the regulations, currencies, and logistics of each region.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  flag: "🇪🇺",
                  title: "European Union",
                  desc: "Cross-border FMCG distribution with full compliance, multi-language storefronts, and EUR settlement.",
                  tags: ["Cross-border", "VAT & compliance", "EUR", "Multi-language"],
                },
                {
                  flag: "🕌",
                  title: "Middle East",
                  desc: "High-growth retail networks connected end-to-end, with Arabic-first UX and multi-currency support.",
                  tags: ["Arabic-first", "AED / SAR", "GCC logistics", "Trade credit"],
                },
              ].map(({ flag, title, desc, tags }) => (
                <div key={title} className="rounded-2xl border border-white/8 bg-gradient-to-b from-[#10131f] to-[#0b0e17] p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-violet-500/25 bg-violet-500/12 text-[22px]">{flag}</div>
                    <h3 className="text-[20px] font-bold text-white">{title}</h3>
                  </div>
                  <p className="mb-4 text-[15px] leading-relaxed text-slate-400">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="rounded-full border border-white/14 bg-white/2 px-3 py-1 text-[13px] text-slate-400">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-white/5 px-6 py-20">
          <div className="container mx-auto max-w-[1140px]">
            <div className="relative overflow-hidden rounded-[24px] border border-white/14 p-16 text-center" style={{
              background: "radial-gradient(500px 300px at 50% 0%, rgba(91,140,255,0.22), transparent 65%), linear-gradient(180deg,#10131f,#0b0e17)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.5)"
            }}>
              <h2 className="text-[clamp(30px,4.5vw,46px)] font-extrabold tracking-tight" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                Move your distribution in a blink
              </h2>
              <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-slate-400">
                Validate your deal with the ROI calculator, or reach out directly to book a sandbox session with the Draviqo team.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/b2b">
                  <Button size="lg" className="h-12 bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg hover:scale-[1.02] hover:opacity-95 transition-all">
                    <Calculator className="mr-2 h-4 w-4" /> Open Deal Validator
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 border-white/10 bg-white/5 font-semibold text-white hover:bg-white/10 hover:scale-[1.02] transition-all">
                    Submit Deal Proposal
                  </Button>
                </Link>
              </div>
              <p className="mt-5 text-[13px] text-slate-600">No spreadsheets. No phone orders. Just one intelligent network.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-14">
        <div className="container mx-auto max-w-[1140px]">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 font-bold text-lg" style={{ fontFamily: "'Sora', Inter, sans-serif" }}>
                <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-xs font-bold">D</span>
                Draviqo
              </Link>
              <p className="mt-4 text-[14px] leading-relaxed text-slate-500">The AI-native OS moving FMCG from supplier to shelf across the EU and the Middle East.</p>
            </div>
            {[
              { title: "Product", links: [["SwishOS Demo", "/qcommerce"], ["Deal Validator", "/b2b"], ["B2B OS", "#b2bos"]] },
              { title: "Regions", links: [["European Union", "#regions"], ["Middle East", "#regions"]] },
              { title: "Company", links: [["Submit Deal", "/contact"], ["Book a Demo", "/contact"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h5 className="mb-3.5 text-[13px] font-semibold uppercase tracking-[.1em] text-slate-600">{title}</h5>
                <ul className="grid gap-2.5">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-[14px] text-slate-500 hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-11 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 text-[13px] text-slate-600">
            <span>© 2026 Draviqo. All rights reserved.</span>
            <span>B2B distribution, in a blink.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
