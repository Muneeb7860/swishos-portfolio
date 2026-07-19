import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import { ThemeProvider } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ServiceBot } from "../../components/ServiceBot";
import { MobileMenu } from "../../components/MobileMenu";
import { ChatwootWidget } from "../../components/ChatwootWidget";
import { SupportChatDrawer } from "../../components/SupportChatDrawer";

import en from "../../dictionaries/en.json";
import ar from "../../dictionaries/ar.json";

const dictionaries: Record<string, typeof en> = { en, ar };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const dict = dictionaries[lang] || en;
  const url = `https://swishos.io/${lang}`;
  return {
    metadataBase: new URL('https://swishos.io'),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: { en: 'https://swishos.io/en', ar: 'https://swishos.io/ar' },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url,
      siteName: 'SwishOS',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [{ url: '/logo-light.png', width: 1200, height: 630, alt: 'SwishOS' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/logo-light.png'],
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = dictionaries[lang] || en;
  const isRtl = lang === 'ar';

  return (
    <html lang={lang} suppressHydrationWarning dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          
          {/* GLOBAL NAVIGATION */}
          <header>
            <div className="wrap nav">
              <Link href={`/${lang}`} className="brand">
                <Image src="/logo-light.png" alt="SwishOS" className="brand-logo-light" width={160} height={40} priority />
                <Image src="/logo-dark.png" alt="SwishOS" className="brand-logo-dark" width={160} height={40} priority />
              </Link>
              <nav className="nav-links">
                <Link href={`/${lang}`}>{dict.nav.home}</Link>
                <Link href={`/${lang}/features`}>{dict.nav.features}</Link>
                <Link href={`/${lang}/pricing`}>{dict.nav.pricing}</Link>
                <Link href={`/${lang}/vision`}>{dict.nav.vision}</Link>
                <Link href={`/${lang}/support`}>{dict.nav.support}</Link>
              </nav>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <LanguageSwitcher currentLang={lang} />
                <ThemeToggle />
                <Link href={`/${lang}/contact`} className="nav-cta nav-cta-desktop">{dict.nav.contact}</Link>
                <MobileMenu
                  links={[
                    { href: `/${lang}`, label: dict.nav.home },
                    { href: `/${lang}/features`, label: dict.nav.features },
                    { href: `/${lang}/pricing`, label: dict.nav.pricing },
                    { href: `/${lang}/vision`, label: dict.nav.vision },
                    { href: `/${lang}/support`, label: dict.nav.support },
                  ]}
                  cta={{ primaryHref: `/${lang}/contact`, primaryLabel: dict.nav.contact }}
                />
              </div>
            </div>
          </header>

          {props.children}

          {/* GLOBAL FOOTER */}
          <footer>
            <div className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: '40px', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', flexWrap: 'wrap', gap: '20px' }}>
              <p style={{ fontSize: '14px' }}>© 2026 SwishOS. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link href={`/${lang}/support`} style={{ color: 'var(--muted)', fontSize: '14px', transition: 'color 0.2s' }}>{dict.nav.support}</Link>
                <Link href={`/${lang}/contact`} style={{ color: 'var(--muted)', fontSize: '14px', transition: 'color 0.2s' }}>{dict.nav.contact}</Link>
                <a href="mailto:hello@swishos.io" style={{ color: 'var(--muted)', fontSize: '14px' }}>hello@swishos.io</a>
              </div>
            </div>
          </footer>

          {/* SERVICE BOT MOCKUP */}
          <ServiceBot dict={dict.bot} />

          {/* OPEN-SOURCE CHATWOOT & LIVE SUPPORT DRAWER */}
          <ChatwootWidget lang={lang} />
          <SupportChatDrawer lang={lang} />

        </ThemeProvider>
      </body>
    </html>
  );
}
