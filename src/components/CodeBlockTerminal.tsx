'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';

interface CodeBlockTerminalProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlockTerminal({ code, language = 'bash', filename }: CodeBlockTerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div style={{
      background: '#0B0F17',
      border: '1px solid var(--line-strong)',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
      fontSize: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    }}>
      {/* Terminal Bar */}
      <div style={{
        background: '#161E2E',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
          </div>
          {filename && (
            <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px', fontWeight: 600 }}>
              {filename}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#38BDF8',
            background: 'rgba(56, 189, 248, 0.12)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
          }}>
            {language}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy code to clipboard"
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#34D399' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'color 0.2s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Container */}
      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        color: '#F8FAFC',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
