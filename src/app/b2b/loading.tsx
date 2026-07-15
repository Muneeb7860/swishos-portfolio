/**
 * B2B route loading skeleton shown while the Deal Validator
 * client component is being hydrated.
 */
export default function B2BLoading() {
  return (
    <div className="min-h-screen bg-[#030408] px-4 py-8 animate-pulse">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Back link + title */}
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="h-9 w-48 rounded-xl bg-white/8" />
          <div className="h-4 w-64 rounded bg-white/4" />
        </div>

        {/* Two column grid */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Form card skeleton */}
          <div className="md:col-span-5 rounded-3xl border border-white/5 bg-white/2 p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-white/5" />
                <div className="h-9 w-full rounded-lg bg-white/4" />
              </div>
            ))}
          </div>

          {/* Results card skeleton */}
          <div className="md:col-span-7 rounded-3xl border border-white/5 bg-white/2 p-6 space-y-5">
            <div className="h-6 w-48 rounded bg-white/8" />
            <div className="h-[100px] rounded-2xl bg-white/4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 rounded-2xl bg-white/4" />
              <div className="h-20 rounded-2xl bg-white/4" />
            </div>
            <div className="h-[140px] rounded-xl bg-white/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
