'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChatwootWidget } from './ChatwootWidget';

export function ConditionalChatwoot({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();

  // Route Check: Suppress B2C chat widget on all commercial, developer, advisory, pricing, and high-ticket audit routes.
  // Enterprise CISOs and VPs of Engineering do not buy $12.5k audits or red-team retainers through a chat bubble widget.
  const isExcludedRoute =
    pathname?.includes('/advisory') ||
    pathname?.includes('/developers') ||
    pathname?.includes('/pricing') ||
    pathname?.includes('/contact') ||
    pathname?.includes('/roi') ||
    pathname?.includes('/engagements');

  if (isExcludedRoute) {
    return null;
  }

  return <ChatwootWidget lang={lang} />;
}
