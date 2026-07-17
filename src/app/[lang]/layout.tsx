import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { ThemeProvider } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

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
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
                <span className="logo"></span>SwishOS
              </Link>
              <nav className="nav-links">
                <Link href={`/${lang}`}>{dict.nav.home}</Link>
                <Link href={`/${lang}/features`}>{dict.nav.features}</Link>
                <Link href={`/${lang}/vision`}>{dict.nav.vision}</Link>
                <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
              </nav>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <LanguageSwitcher currentLang={lang} />
                <ThemeToggle />
                <Link href={`/${lang}/login`} style={{ color: 'var(--txt)', fontSize: '14px', fontWeight: 600, padding: '9px 18px' }}>{dict.nav.login}</Link>
                <Link href={`/${lang}/signup`} className="nav-cta">{dict.nav.signup}</Link>
              </div>
            </div>
          </header>

          {props.children}

          {/* GLOBAL FOOTER */}
          <footer>
            <div className="wrap" style={{ borderTop: '1px solid var(--line)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', flexWrap: 'wrap', gap: '20px' }}>
              <p>SwishOS | Service Catalog © 2026</p>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <a href="#" style={{ color: 'var(--muted)', fontSize: '14px' }}>Twitter</a>
                <a href="#" style={{ color: 'var(--muted)', fontSize: '14px' }}>LinkedIn</a>
                <a href="#" style={{ color: 'var(--muted)', fontSize: '14px' }}>GitHub</a>
              </div>
            </div>
          </footer>

          {/* SERVICE BOT MOCKUP */}
          <div className="service-bot" title="Service Bot">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
