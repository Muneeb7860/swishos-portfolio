import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | احجز تدقيقاً أمنياً'
        : 'SwishOS | Book an AI Agent Security Audit',
    description:
      lang === 'ar'
        ? 'أخبرني بما يمكن لوكيلك الوصول إليه. ابدأ محادثة حول تدقيق الأمن أو خدمات الاستشارة.'
        : 'Tell me what your agent can touch. Start a conversation about a security audit, guardrail retainer, or enterprise engagement.',
  };
}

export default async function ContactPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return (
    <Suspense>
      <ContactClient lang={lang} />
    </Suspense>
  );
}
