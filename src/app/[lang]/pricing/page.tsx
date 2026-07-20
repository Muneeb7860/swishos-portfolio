import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | التسعير والارتباطات'
        : 'SwishOS | Engagements — Security Audit & Retainer Pricing',
    description:
      lang === 'ar'
        ? 'ابدأ مجاناً بأداة المصدر المفتوح. أشركني في تدقيق محدد النطاق عندما يكون وكيلك على وشك لمس الأموال أو البيانات.'
        : 'Start free with the open-source harness. Bring me in for a fixed-scope audit when your agent is about to touch money, customer data, or production systems.',
  };
}

export default async function PricingPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <PricingClient lang={lang} />;
}
