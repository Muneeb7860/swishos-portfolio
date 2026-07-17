import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwishOS | Service Catalog",
  description: "Swishos delivers a unified, AI-native platform for B2B supply chain and quick commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* GLOBAL NAVIGATION */}
        <header>
          <div className="wrap nav">
            <Link href="/" className="brand">
              <span className="logo"></span>SwishOS
            </Link>
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/features">Features</Link>
              <Link href="/vision">Vision</Link>
              <Link href="/contact">Contact Us</Link>
            </nav>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/login" style={{ color: 'var(--txt)', fontSize: '14px', fontWeight: 600, padding: '9px 18px' }}>Log In</Link>
              <Link href="/signup" className="nav-cta">Sign Up</Link>
            </div>
          </div>
        </header>

        {children}

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

      </body>
    </html>
  );
}
