import { redirect } from 'next/navigation';

// The old ROI page was a quick-commerce fulfilment-savings calculator and no longer
// reflects what SwishOS does. The route is kept so any existing inbound or indexed
// link lands somewhere sensible instead of 404-ing. Safe to delete this folder
// entirely once you're confident nothing links here.
export default async function RoiRedirect(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  redirect(`/${lang}/pricing`);
}
