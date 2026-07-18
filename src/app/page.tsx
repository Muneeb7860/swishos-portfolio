import { redirect } from 'next/navigation';

// Server-side redirect. This was previously a client component redirecting inside a
// useEffect, which meant crawlers and social scrapers received an empty page and
// users saw a blank flash before navigation.
export default function RootPage() {
  redirect('/en');
}
