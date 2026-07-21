import { Metadata } from 'next';
import { PlaygroundClient } from './PlaygroundClient';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const isAr = lang === 'ar';
  return {
    title: isAr ? 'مختبر أمن وكيل الذكاء الاصطناعي التفاعلي | SwishOS' : 'Interactive AI Agent Security Playground | SwishOS',
    description: isAr
      ? 'اختبر حمولات الهجوم الضارة ونورماليزايشن يونيكود والتحقق من أذونات AST مباشرة عبر حواجز الحماية'
      : 'Test adversarial attack payloads, NFKC normalization, Base64 inspection, and AST bounds live against SwishOS guardrails.',
  };
}

export default async function PlaygroundPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <PlaygroundClient lang={lang} />;
}
