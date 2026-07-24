'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChatwootWidget } from './ChatwootWidget';

export function ConditionalChatwoot({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();

  // Pure React route check: If on /advisory or /developers, RETURN NULL IMMEDIATELY.
  // Never mount ChatwootWidget or inject Chatwoot SDK scripts on these routes.
  const isExcludedRoute = pathname?.includes('/advisory') || pathname?.includes('/developers');

  if (isExcludedRoute) {
    return null;
  }

  return <ChatwootWidget lang={lang} />;
}
