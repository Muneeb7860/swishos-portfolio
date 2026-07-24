'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble?: boolean;
      position?: 'left' | 'right';
      locale?: string;
      type?: 'standard' | 'expanded';
      theme?: 'dark' | 'light' | 'auto';
    };
    $chatwoot?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
      setUser: (id: string, user: Record<string, unknown>) => void;
      setCustomAttributes: (attributes: Record<string, unknown>) => void;
      toggle: (state?: string) => void;
    };
  }
}

export function ChatwootWidget({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();

  // Suppress floating B2C chat widget on executive advisory and developer SDK routes
  const isExcludedRoute = pathname?.includes('/advisory') || pathname?.includes('/developers');

  useEffect(() => {
    if (isExcludedRoute) return;

    const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || 'https://app.chatwoot.com';

    if (!websiteToken) return;

    window.chatwootSettings = {
      hideMessageBubble: false,
      position: lang === 'ar' ? 'left' : 'right',
      locale: lang === 'ar' ? 'ar' : 'en',
      theme: 'dark',
    };

    if (document.getElementById('chatwoot-sdk')) return;

    const script = document.createElement('script');
    script.id = 'chatwoot-sdk';
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;

    script.onload = () => {
      if (window.$chatwoot) {
        window.$chatwoot.run({
          websiteToken,
          baseUrl,
        });

        window.$chatwoot.setCustomAttributes({
          platform: 'SwishOS Web Portal',
          environment: 'production',
          lang,
        });
      }
    };

    document.body.appendChild(script);
  }, [lang, isExcludedRoute]);

  if (isExcludedRoute) return null;

  return null;
}
