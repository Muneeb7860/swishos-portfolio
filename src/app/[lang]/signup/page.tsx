import type { Metadata } from 'next';
import SignupClient from './SignupClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | إنشاء حساب'
        : 'SwishOS | Request Access — Enterprise Beta',
    description:
      lang === 'ar'
        ? 'انضم إلى البيتا الخاصة لـ SwishOS. الوصول متاح للمؤسسات المختارة العاملة في أمان وكلاء الذكاء الاصطناعي.'
        : 'Join the SwishOS private beta. Access is granted to select enterprises building production AI agents that touch money, data, or critical systems.',
  };
}

export default async function SignupPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <SignupClient lang={lang} />;
}
