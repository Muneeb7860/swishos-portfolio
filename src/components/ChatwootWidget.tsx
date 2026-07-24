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
      hideMessageBubble: () => void;
      showWidget: () => void;
      hideWidget: () => void;
    };
  }
}

export function ChatwootWidget({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();

  // Suppress floating B2C chat widget on executive advisory and developer SDK routes
  const isExcludedRoute = pathname?.includes('/advisory') || pathname?.includes('/developers');

  useEffect(() => {
    // If on an excluded route, physically purge/hide any Chatwoot widget DOM elements
    if (isExcludedRoute) {
      if (window.$chatwoot?.hideWidget) {
        try {
          window.$chatwoot.hideWidget();
        } catch {}
      }

      // Hide or remove Chatwoot DOM elements from document body
      const elementsToHide = document.querySelectorAll(
        '.woot-widget-holder, .woot--bubble-holder, .woot-elements-holder, #chatwoot-widget-provider'
      );
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      return;
    }

    const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || 'https://app.chatwoot.com';

    if (!websiteToken) return;

    window.chatwootSettings = {
      hideMessageBubble: false,
      position: lang === 'ar' ? 'left' : 'right',
      locale: lang === 'ar' ? 'ar' : 'en',
      theme: 'dark',
    };

    if (document.getElementById('chatwoot-sdk')) {
      if (window.$chatwoot?.showWidget) {
        try {
          window.$chatwoot.showWidget();
        } catch {}
      }
      return;
    }

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
  }, [lang, isExcludedRoute, pathname]);

  return null;
}
