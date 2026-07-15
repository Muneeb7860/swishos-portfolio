import Link from "next/link";
import { ArrowLeft, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#06070c] text-slate-100 flex flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[20%] top-[10%] h-[50%] w-[60%] rounded-full bg-indigo-600/12 blur-[140px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/3">
            <Frown className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <h1
          className="text-[72px] font-extrabold leading-none tracking-tight"
          style={{ fontFamily: "'Sora', Inter, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-white">Page not found</h2>
        <p className="mt-3 text-[15px] text-slate-400">
          We couldn&apos;t find what you were looking for. It may have moved or
          never existed on Draviqo.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Draviqo
            </Button>
          </Link>
          <Link href="/b2b">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Open Deal Validator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
