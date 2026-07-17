import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { ThemeProvider } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ServiceBot } from "../../components/ServiceBot";
import { MobileMenu } from "../../components/MobileMenu";

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
                <img src="/logo-light.png" alt="SwishOS" className="brand-logo-light" width={160} />
                <img src="/logo-dark.png" alt="SwishOS" className="brand-logo-dark" width={160} />
              </Link>
              <nav className="nav-links">
                <Link href={`/${lang}`}>{dict.nav.home}</Link>
                <Link href={`/${lang}/features`}>{dict.nav.features}</Link>
                <Link href={`/${lang}/roi`}>{dict.nav.roi}</Link>
                <Link href={`/${lang}/vision`}>{dict.nav.vision}</Link>
                <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
              </nav>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <LanguageSwitcher currentLang={lang} />
                <ThemeToggle />
                <Link href={`/${lang}/login`} className="nav-login-btn">{dict.nav.login}</Link>
                <Link href={`/${lang}/signup`} className="nav-cta nav-cta-desktop">{dict.nav.signup}</Link>
                <MobileMenu
                  links={[
                    { href: `/${lang}`, label: dict.nav.home },
                    { href: `/${lang}/features`, label: dict.nav.features },
                    { href: `/${lang}/roi`, label: dict.nav.roi },
                    { href: `/${lang}/vision`, label: dict.nav.vision },
                    { href: `/${lang}/contact`, label: dict.nav.contact },
                  ]}
                  cta={{ loginHref: `/${lang}/login`, loginLabel: dict.nav.login, signupHref: `/${lang}/signup`, signupLabel: dict.nav.signup }}
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
                <Link href={`/${lang}/contact`} style={{ color: 'var(--muted)', fontSize: '14px', transition: 'color 0.2s' }}>{dict.nav.contact}</Link>
                <a href="mailto:hello@swishos.io" style={{ color: 'var(--muted)', fontSize: '14px' }}>hello@swishos.io</a>
              </div>
            </div>
          </footer>

          {/* SERVICE BOT MOCKUP */}
          <ServiceBot dict={dict.bot} />

        </ThemeProvider>
      </body>
    </html>
  );
}
