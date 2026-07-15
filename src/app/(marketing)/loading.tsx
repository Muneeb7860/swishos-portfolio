/**
 * Root-level loading skeleton shown by Next.js App Router
 * while the marketing page (`/`) is being streamed.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#06070c] animate-pulse">
      {/* Nav skeleton */}
      <div className="border-b border-white/5 bg-[#06070c]/60 px-6 py-4">
        <div className="mx-auto flex max-w-[1140px] items-center justify-between">
          <div className="h-7 w-28 rounded-lg bg-white/5" />
          <div className="hidden gap-6 md:flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 rounded bg-white/5" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-28 rounded-lg bg-white/5" />
            <div className="h-8 w-24 rounded-lg bg-white/8" />
          </div>
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="px-6 py-24 text-center">
        <div className="container mx-auto max-w-[1140px] space-y-6 flex flex-col items-center">
          <div className="h-6 w-48 rounded-full bg-white/5" />
          <div className="h-16 w-3/4 rounded-xl bg-white/5" />
          <div className="h-6 w-2/3 rounded-lg bg-white/4" />
          <div className="flex gap-4">
            <div className="h-12 w-40 rounded-xl bg-white/8" />
            <div className="h-12 w-36 rounded-xl bg-white/5" />
          </div>
          <div className="mt-10 h-[280px] w-full max-w-[960px] rounded-2xl bg-white/3" />
        </div>
      </div>
    </div>
  );
}
