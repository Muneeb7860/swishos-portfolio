import type { Metadata } from 'next';
import SupportClient from './SupportClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | الدعم'
        : 'SwishOS | Support — Omni-Channel Security Helpdesk',
    description:
      lang === 'ar'
        ? 'أرسل تعليقاتك، أبلغ عن حوادث أمنية، وتتبع معايير حلول اتفاقية مستوى الخدمة عبر قنوات الويب وAPI والبريد وسلاك ومكتب تدقيق الأمن.'
        : 'Submit feedback, report security incidents, and track resolution metrics across Web, API, Email, Slack, and Enterprise Desk channels.',
  };
}

export default async function SupportPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <SupportClient lang={lang} />;
}
