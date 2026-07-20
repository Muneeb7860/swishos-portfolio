import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | منهجية الأمان'
        : 'SwishOS | The Approach — Red-Teaming, Guardrails & Evals',
    description:
      lang === 'ar'
        ? 'ثلاثة تخصصات مطبقة بالترتيب: اكتشف كيف ينهار وكيلك، أوقف انهياره، ثم أثبت أنه يبقى آمناً.'
        : 'Three disciplines, applied in order: find out how your agent breaks, stop it breaking, then prove it stays fixed as your models and prompts change.',
  };
}

export default async function FeaturesPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <FeaturesClient lang={lang} />;
}

