'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Mail, Target } from 'lucide-react';

interface HeaderNavCtaProps {
  lang: string;
  defaultLabel: string;
}

export function HeaderNavCta({ lang, defaultLabel }: HeaderNavCtaProps) {
  const pathname = usePathname();
  const isDevRoute = pathname?.includes('/developers');
  const isAdvisoryRoute = pathname?.includes('/advisory');

  if (isDevRoute) {
    return (
      <a
        href="https://github.com/Muneeb7860/agentic-redteam"
        target="_blank"
        rel="noopener noreferrer"
        className="!bg-blue-600 !text-white !border-blue-600 nav-cta-desktop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '8px',
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
          border: '1px solid #2563EB',
        }}
      >
        <Terminal size={14} color="#FFFFFF" />
        View PyPI Package →
      </a>
    );
  }

  if (isAdvisoryRoute) {
    return (
      <Link
        href={`/${lang}/contact?plan=advisory`}
        className="!bg-blue-600 !text-white !border-blue-600 nav-cta-desktop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '8px',
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
          border: '1px solid #2563EB',
        }}
      >
        <Mail size={14} color="#FFFFFF" />
        Contact Sales →
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/contact?plan=audit`}
      className="!bg-blue-600 !text-white !border-blue-600 nav-cta-desktop"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '8px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
        border: '1px solid #2563EB',
      }}
    >
      <Target size={14} color="#FFFFFF" />
      Schedule Security Audit
    </Link>
  );
}
