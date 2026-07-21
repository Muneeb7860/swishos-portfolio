'use client';

import React from 'react';

export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Futuristic Shield Icon */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path
          d="M16 3L4 8V16C4 22.627 9.373 28.164 16 29.5C22.627 28.164 28 22.627 28 16V8L16 3Z"
          fill="url(#shield-grad)"
        />
        <path
          d="M16 7L8 11V16C8 20.418 11.582 24.136 16 25.15C20.418 24.136 24 20.418 24 16V11L16 7Z"
          fill="#0F172A"
          fillOpacity="0.4"
        />
        <path
          d="M13 16L15 18L19 14"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="shield-grad" x1="4" y1="3" x2="28" y2="29.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      {/* Brand Text */}
      <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.03em', color: 'var(--txt)' }}>
        Swish<span style={{ color: '#3B82F6' }}>OS</span>
      </span>
    </div>
  );
}
