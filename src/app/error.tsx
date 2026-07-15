"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global App Router error boundary.
 * Catches unhandled runtime errors within the route segment and
 * presents a brand-consistent recovery UI instead of a white crash screen.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to console in development; swap for a real error service in prod
    console.error("[Draviqo Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#06070c] text-slate-100 flex flex-col items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-[20%] top-[10%] h-[50%] w-[60%] rounded-full bg-rose-600/10 blur-[160px]" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/8">
              <AlertTriangle className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: "'Sora', Inter, sans-serif" }}
          >
            Something went wrong
          </h1>
          <p className="mt-3 text-[15px] text-slate-400">
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-1 text-xs text-slate-600 font-mono">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-rose-500 to-orange-500 font-semibold text-white shadow-lg"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
