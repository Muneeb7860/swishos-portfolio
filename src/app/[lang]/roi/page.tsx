import { Metadata } from 'next';
import Link from 'next/link';
import { SpendGovernorWidget } from '@/components/SpendGovernorWidget';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const isAr = lang === 'ar';
  return {
    title: isAr ? 'حساب العائد على الاستثمار وحاكم إنفاق الذكاء الاصطناعي | SwishOS' : 'AI Agent ROI & Spend Governor Calculator | SwishOS',
    description: isAr
      ? 'احسب توفير التكاليف وحماية الميزانية من الهجمات باستخدام حاكم أذونات WASI والتسعير المخصص'
      : 'Calculate cost savings and slow-burn financial protection using WASI capability tokens and AI spend governors.',
  };
}

export default async function RoiPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 border border-emerald-800 text-emerald-400">
            {isAr ? 'الإنفاق المستدام وحماية الميزانية' : 'Financial Safety & Slow-Burn Protection'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {isAr ? 'حاكم إنفاق وكلاء الذكاء الاصطناعي وتوفير التكاليف' : 'AI Agent Spend Governor & ROI Safeguards'}
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            {isAr
              ? 'احمِ مؤسستك من الهجمات البطيئة التي تستنزف ميزانية API عبر حاكم الأذونات التراكمي'
              : 'Prevent slow-burn prompt injection attacks from draining your API budget with WASI capability tokens and 30-day spend limits.'}
          </p>
        </div>

        {/* Interactive Spend Governor Widget */}
        <SpendGovernorWidget isAr={isAr} />

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'جاهز لحماية وكلاء الذكاء الاصطناعي في بيئة الإنتاج؟' : 'Ready to enforce zero-trust financial safety?'}
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            {isAr
              ? 'احجز تدقيق أمن وكلاء الذكاء الاصطناعي وحصول على تقرير مفصل حول الأذونات والحدود المالية.'
              : 'Book a 1-week AI Agent Security Audit ($7,500 – $12,500) and get WASI capability tokens, spend limits, and gVisor isolation.'}
          </p>
          <div className="pt-2">
            <Link
              href={`/${lang}/contact?plan=audit`}
              className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/50"
            >
              {isAr ? '🎯 احجز تدقيق الأمان الآن' : '🎯 Book Security Audit'}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
