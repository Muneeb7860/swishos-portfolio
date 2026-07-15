import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import B2BDashboard from "@/features/b2b/Dashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Deal Validator — B2B ROI Calculator",
  description:
    "Validate your business segment compatibility with SwishOS or Draviqo B2B OS. Calculate ROI savings and request a pre-approved deal proposal.",
  openGraph: {
    title: "Draviqo Deal Validator — B2B ROI Calculator",
    description:
      "Estimate ROI, check OS compatibility, and lock in pre-approved pricing — for SwishOS and Draviqo B2B OS.",
    url: "https://draviqo.com/b2b",
  },
  twitter: {
    title: "Draviqo Deal Validator",
    description: "Validate ROI & OS compatibility for SwishOS / Draviqo B2B OS in seconds.",
  },
};


export default function B2BPage() {
  return (
    <div className="relative min-h-screen bg-[#030408] text-slate-100 overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-2 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Draviqo Portfolio
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Deal Validator</h1>
            <p className="text-sm text-slate-400 mt-1">Operational Compatibility & ROI Estimation Engine</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-slate-900/30 px-3.5 py-1.5 text-xs text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Deal Sandbox
          </div>
        </div>

        {/* Dashboard Component inside ErrorBoundary */}
        <ErrorBoundary>
          <B2BDashboard />
        </ErrorBoundary>
      </main>
    </div>
  );
}
