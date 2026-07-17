'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    // Replace the current language in the pathname
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <select
      value={currentLang}
      onChange={handleLanguageChange}
      style={{
        background: 'var(--panel)',
        color: 'var(--txt)',
        border: '1px solid var(--line-strong)',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        outline: 'none'
      }}
    >
      <option value="en">EN</option>
      <option value="ar">AR</option>
    </select>
  );
}
