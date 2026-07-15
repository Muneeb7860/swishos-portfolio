import Link from "next/link";
import { ArrowRight, Layers, Zap, ShoppingBag, Globe, CheckCircle2, ChevronRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Draviqo — Custom Enterprise Commerce Suites",
  description: "Draviqo license and configures advanced operating systems like SwishOS for B2B distribution and quick commerce.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030408] text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030408]/65 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </span>
            <span>Draviqo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <Link href="/b2b" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5" /> Deal Validator
            </Link>
            <Link href="/qcommerce" className="hover:text-emerald-400 transition-colors">SwishOS Showcase</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Submit Deal Proposal</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/b2b">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold transition-all">
                Validate Deal
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold hover:opacity-95 shadow-[0_4px_12px_rgba(16,185,129,0.25)] transition-all">
                Submit Deal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4">
        {/* Hero Section focusing on SwishOS */}
        <section className="container mx-auto max-w-5xl pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-8 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Flagship Product: SwishOS Q-Commerce Suite
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
            License SwishOS for Your Retail Network,<br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-indigo-400 bg-clip-text text-transparent">
              validate deals in seconds.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            Draviqo helps enterprise commerce companies, local groceries, and delivery networks integrate <strong className="text-white">SwishOS</strong> — our high-performance operating system for hyper-local catalog management, automated routing, and instant settlements.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/b2b">
              <Button size="lg" className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold hover:opacity-95 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.02]">
                Validate Business Deal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/qcommerce">
              <Button size="lg" variant="outline" className="h-12 px-6 border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-[1.02]">
                See SwishOS Showcase
              </Button>
            </Link>
          </div>
        </section>

        {/* Product Card showing SwishOS vs B2B */}
        <section id="solutions" className="container mx-auto max-w-5xl py-12">
          <div className="grid md:grid-cols-12 gap-8 items-center border border-white/5 bg-slate-900/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />
            <div className="md:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 px-3 py-1">
                Hero Application
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                SwishOS: The Quick-Commerce Standard
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Connect and streamline your local fulfillment. SwishOS integrates directly with your active POS, WMS, or local store catalogs to orchestrate instant sub-15 minute delivery runs.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Sub-15 Minute Dispatch Router</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Real-time Rider GPS Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Dynamic Cart Bottom-Sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Automated Stock Allocation</span>
                </div>
              </div>
              <div className="pt-2 flex gap-4">
                <Link href="/qcommerce">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                    Launch Interactive Demo
                  </Button>
                </Link>
                <Link href="/b2b">
                  <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white border border-white/10 hover:bg-white/5">
                    Estimate Licensing ROI
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              {/* Visual Mock of mobile SwishOS screen */}
              <div className="w-[200px] h-[340px] border border-white/10 bg-slate-950/80 rounded-[32px] p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="w-16 h-3 bg-black rounded-b-lg mx-auto" />
                <div className="border border-white/5 bg-slate-900/40 rounded-xl p-2 mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[7px] text-emerald-400 font-extrabold uppercase">SWISHOS LIVE</span>
                    <h5 className="text-[10px] font-bold text-white mt-0.5">Downtown Darkstore #04</h5>
                    <div className="h-16 bg-slate-950 rounded-lg mt-2 flex items-center justify-center text-[9px] text-slate-500 border border-white/2">
                      Rider Tracking Active
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                    <span className="text-slate-400">Total basket</span>
                    <strong className="text-white">$34.50</strong>
                  </div>
                </div>
                <div className="h-8 bg-emerald-500 rounded-xl mt-3 flex items-center justify-center text-[10px] text-white font-bold select-none cursor-pointer">
                  Checkout via SwishOS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deal Validator Promotion */}
        <section className="container mx-auto max-w-5xl py-16 border-t border-white/5 text-center">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Connect & Validate</span>
          <h2 className="text-3xl font-extrabold text-white mt-3">Validate Your Deal in Real Time</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
            Input your current operational metrics to evaluate compatibility with SwishOS or Draviqo B2B, calculate estimated savings, and lock in deal proposals.
          </p>
          <div className="mt-8">
            <Link href="/b2b">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                Open Deal Validator Portal
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/20">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between px-4 gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-white font-bold text-xs">D</span>
            <span>© 2026 Draviqo. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/b2b" className="hover:text-emerald-400 transition-colors">Deal Validator</Link>
            <Link href="/qcommerce" className="hover:text-emerald-400 transition-colors">SwishOS</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
