'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChatwootWidget } from './ChatwootWidget';

export function ConditionalChatwoot({ lang = 'en' }: { lang?: string }) {
  const pathname = usePathname();

  // Suppress chat widget on all commercial, advisory, developer, support, and pricing routes.
  const isExcludedRoute =
    pathname?.includes('/advisory') ||
    pathname?.includes('/developers') ||
    pathname?.includes('/support') ||
    pathname?.includes('/pricing') ||
    pathname?.includes('/contact') ||
    pathname?.includes('/roi') ||
    pathname?.includes('/engagements');

  if (isExcludedRoute) {
    return null;
  }

  return <ChatwootWidget lang={lang} />;
}
