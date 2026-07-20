import type { Metadata } from 'next';
import VisionClient from './VisionClient';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title:
      lang === 'ar'
        ? 'SwishOS | الرؤية'
        : 'SwishOS | Vision — Agent Security is a Systems Problem',
    description:
      lang === 'ar'
        ? 'وكالة الذكاء الاصطناعي تصل بشكل أسرع مما تستطيع الضوابط مواكبته. نموذج الأمان الأساسي تحتها لم يواكب الخطى.'
        : 'Every quarter, more AI systems move from answering questions to taking actions. The security model underneath them has not kept pace.',
  };
}

export default async function VisionPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  return <VisionClient lang={lang} />;
}

