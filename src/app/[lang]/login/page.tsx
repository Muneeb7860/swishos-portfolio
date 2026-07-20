import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | تسجيل الدخول'
        : 'SwishOS | Client Portal Login',
    description:
      lang === 'ar'
        ? 'وصول العملاء إلى بوابة SwishOS الخاصة. النسخة التجريبية الخاصة متاحة للمؤسسات المختارة فقط.'
        : 'SwishOS client portal access. Private Beta is currently available to select enterprise clients only.',
  };
}

export default async function LoginPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <LoginClient lang={lang} />;
}
