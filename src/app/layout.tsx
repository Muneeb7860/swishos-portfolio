import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Site-wide default metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://draviqo.com"),
  title: {
    default: "Draviqo — Commerce Operating Systems & Apps",
    template: "%s | Draviqo",
  },
  description:
    "Draviqo licenses AI-native operating systems for commerce — SwishOS for quick-commerce delivery and B2B OS for enterprise FMCG distribution across the EU and Middle East.",
  keywords: [
    "SwishOS",
    "Draviqo",
    "B2B OS",
    "quick commerce",
    "FMCG distribution",
    "deal validator",
    "commerce software",
    "delivery OS",
    "supply chain",
  ],
  authors: [{ name: "Draviqo", url: "https://draviqo.com" }],
  creator: "Draviqo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://draviqo.com",
    siteName: "Draviqo",
    title: "Draviqo — Commerce Operating Systems & Apps",
    description:
      "Draviqo licenses AI-native OSes — SwishOS for Q-commerce and B2B OS for enterprise distribution. Validate your deal in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Draviqo — Commerce Operating Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draviqo — Commerce Operating Systems & Apps",
    description:
      "Draviqo licenses AI-native OSes — SwishOS for Q-commerce and B2B OS for enterprise distribution.",
    images: ["/og-image.png"],
    creator: "@draviqo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ── Viewport ──────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#06070c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030408]">
        {children}
        <Toaster theme="dark" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
