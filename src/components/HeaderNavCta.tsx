'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Calendar } from 'lucide-react';

interface HeaderNavCtaProps {
  lang: string;
  defaultLabel: string;
}

export function HeaderNavCta({ lang, defaultLabel }: HeaderNavCtaProps) {
  const pathname = usePathname();
  const isDevRoute = pathname?.includes('/developers');

  if (isDevRoute) {
    return (
      <a
        href="https://github.com/Muneeb7860/agentic-redteam"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-cta nav-cta-desktop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          color: '#38BDF8',
        }}
      >
        <Terminal size={14} />
        View PyPI Package →
      </a>
    );
  }

  return (
    <Link href={`/${lang}/contact?plan=audit`} className="nav-cta nav-cta-desktop">
      {defaultLabel}
    </Link>
  );
}
