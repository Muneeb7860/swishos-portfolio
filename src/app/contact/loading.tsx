/**
 * Contact route loading skeleton shown while the
 * ContactFormInner (useSearchParams) client component is hydrating.
 */
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[#030408] px-4 py-16 animate-pulse">
      <div className="container mx-auto max-w-lg space-y-6">
        <div className="h-4 w-36 rounded bg-white/5" />
        <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
          <div className="border-b border-white/5 bg-white/2 p-8 space-y-3">
            <div className="h-5 w-28 rounded-full bg-white/8" />
            <div className="h-7 w-48 rounded-lg bg-white/8" />
            <div className="h-4 w-full rounded bg-white/4" />
          </div>
          <div className="p-8 space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-white/5" />
                <div className={`w-full rounded-xl bg-white/4 ${i === 5 ? "h-24" : "h-10"}`} />
              </div>
            ))}
            <div className="h-11 w-full rounded-xl bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  );
}
