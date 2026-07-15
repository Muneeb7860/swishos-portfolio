/**
 * Q-Commerce route loading skeleton shown while the
 * SwishOS product grid client component is hydrating.
 */
export default function QCommerceLoading() {
  return (
    <div className="min-h-screen bg-[#07080d] animate-pulse">
      {/* Simulated phone-frame header */}
      <div className="mx-auto max-w-[420px] border-x border-white/5">
        {/* Status bar */}
        <div className="h-8 bg-black/80" />
        {/* App header skeleton */}
        <div className="p-4 bg-slate-950/40 border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20" />
              <div className="space-y-1">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-2.5 w-24 rounded bg-white/5" />
              </div>
            </div>
            <div className="h-5 w-28 rounded-full bg-emerald-500/10" />
          </div>
          {/* Search bar */}
          <div className="h-9 w-full rounded-lg bg-white/5" />
          {/* Category pills */}
          <div className="flex gap-1.5 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-14 flex-shrink-0 rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="p-4 grid grid-cols-2 gap-3.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 overflow-hidden">
              <div className="aspect-square bg-white/5" />
              <div className="p-3 space-y-2">
                <div className="h-2 w-12 rounded bg-emerald-500/20" />
                <div className="h-3 w-full rounded bg-white/8" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-10 rounded bg-white/10" />
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
