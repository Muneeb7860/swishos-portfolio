import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import "@/lib/secret-guard";
import { ThemeProvider } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ServiceBot } from "../../components/ServiceBot";
import { MobileMenu } from "../../components/MobileMenu";
import { ChatwootWidget } from "../../components/ChatwootWidget";
import { SupportChatDrawer } from "../../components/SupportChatDrawer";
import { BrandLogo } from "../../components/BrandLogo";

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
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem disableTransitionOnChange>
          
          {/* GLOBAL NAVIGATION */}
          <header>
            <div className="wrap nav">
              <Link href={`/${lang}`} style={{ textDecoration: 'none' }}>
                <BrandLogo />
              </Link>
              <nav className="nav-links">
                <Link href={`/${lang}`}>{dict.nav.home}</Link>
                <Link href={`/${lang}/playground`}>{dict.nav.playground}</Link>
                <Link href={`/${lang}/pricing`}>{dict.nav.pricing}</Link>
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
                    { href: `/${lang}/playground`, label: dict.nav.playground },
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
            <div className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: '56px', paddingBottom: '56px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', width: '100%', justifyContent: 'space-between', marginBottom: '48px' }}>
                {/* Brand */}
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '18px', marginBottom: '12px', color: 'var(--txt)' }}>
                    SwishOS
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '360px' }}>
                    {dict.footer?.tagline || 'AI Agent Security & Governance. Red-teaming, guardrails, and continuous evals.'}
                  </p>
                </div>
                {/* Navigation */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-2)', marginBottom: '16px' }}>
                    {dict.footer?.navTitle || 'Navigation'}
                  </div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href={`/${lang}`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.home}</Link>
                    <Link href={`/${lang}/features`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.features}</Link>
                    <Link href={`/${lang}/pricing`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.pricing}</Link>
                    <Link href={`/${lang}/vision`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.vision}</Link>
                  </nav>
                </div>
                {/* Support */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-2)', marginBottom: '16px' }}>
                    {dict.footer?.supportTitle || 'Support'}
                  </div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href={`/${lang}/support`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.support}</Link>
                    <Link href={`/${lang}/contact`} style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>{dict.nav.contact}</Link>
                    <a href="mailto:hello@swishos.io" style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}>hello@swishos.io</a>
                  </nav>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: 'var(--muted-2)' }}>{dict.footer?.rights || '© 2026 SwishOS. All rights reserved.'}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted-2)' }}>{dict.footer?.builtBy || 'Built by an architect who shipped LLM guardrails at national scale.'}</p>
              </div>
            </div>
          </footer>


          {/* OPEN-SOURCE CHATWOOT & LIVE SUPPORT DRAWER */}
          <ChatwootWidget lang={lang} />
          <SupportChatDrawer lang={lang} />

        </ThemeProvider>
      </body>
    </html>
  );
}
