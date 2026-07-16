import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import SwishProductGrid from "@/features/qcommerce/ProductGrid";
import { mockQCommerceProducts } from "@/lib/mock";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "SwishOS Q-Commerce — Hyper-Local Delivery App Showcase",
  description:
    "Experience SwishOS live: add to cart, checkout and watch the dispatch stepper — a hyper-local instant delivery OS showcase by SwishOS.io.",
  openGraph: {
    title: "SwishOS Q-Commerce — Hyper-Local Delivery App Showcase",
    description: "Live interactive demo of SwishOS — the flagship quick-commerce delivery operating system.",
    url: "https://swishos.io/qcommerce",
  },
  twitter: {
    title: "SwishOS Q-Commerce — Live Demo",
    description: "Cart, checkout & live dispatch tracker — SwishOS.io.",
  },
};


export default function QCommercePage() {
  return (
    <div className="relative min-h-screen bg-[#030408] text-slate-100 overflow-y-auto py-8 px-4 font-sans">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side Info Panel (Desktop) */}
        <div className="md:col-span-5 space-y-6 md:sticky md:top-8 mt-4 md:mt-24">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to SwishOS
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 mb-3">
              <Sparkles className="h-3 w-3" /> SwishOS Showcase
            </span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">SwishOS Mobile</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              SwishOS is the hyper-local instant delivery operating system by <strong className="text-white">SwishOS.io</strong>. Ideal for quick-commerce startups, regional supermarkets, and delivery networks looking for sub-15 minute dispatch capabilities.
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 space-y-4 text-xs text-slate-400 leading-relaxed">
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">What is simulated here:</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>Mobile shell simulation (09:41 status bar)</li>
              <li>Product search & dynamic category toggle states</li>
              <li>Framer-animated bottom-sheet Cart interface</li>
              <li>Stateful checkout triggering a live dispatch tracker</li>
              <li>Step-by-step progress stepper simulation</li>
            </ul>
          </div>
        </div>

        {/* Right Side Mobile Phone Shell */}
        <div className="md:col-span-7 flex justify-center">
          <ErrorBoundary>
            <SwishProductGrid products={mockQCommerceProducts} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
