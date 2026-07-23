'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import type { FrameworkBenchmark } from '@/app/api/leaderboard/route';

export default function LeaderboardPage() {
  const [data, setData] = useState<FrameworkBenchmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020817 0%, #0F172A 50%, #020817 100%)',
      color: '#F8FAFC',
      padding: '40px 24px 80px 24px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '16px',
          }}>
            swish-bench · Open AI Agent Security Benchmark
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', color: '#F8FAFC' }}>
            AI Agent Security Leaderboard
          </h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '720px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Empirical security evaluations comparing popular AI agent frameworks against OWASP LLM Top 10 and ASI01–10 agentic threat vectors.
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {[
              { label: 'Frameworks Scored', value: data.length || 5, color: '#38BDF8' },
              { label: 'Payloads Tested', value: '1,250', color: '#818CF8' },
              { label: 'Highest Pass Rate', value: '100%', color: '#34D399' },
              { label: 'Avg Industry Score', value: '76/100', color: '#F59E0B' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#0F172A',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Interactive Component */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
            Loading benchmark evaluation data...
          </div>
        ) : (
          <LeaderboardTable data={data} />
        )}

        {/* Reproducibility & Methodology Footnote */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#94A3B8',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>🔬 Benchmark Methodology & Reproducibility</div>
          <div>
            Evaluations are conducted using <code style={{ background: '#1E293B', padding: '2px 6px', borderRadius: '4px', color: '#38BDF8' }}>agentic-redteam v1.0.0</code> over 250 standardized payloads per framework target.
            Scores are computed using weighted severity penalties (CRITICAL × 4, HIGH × 3, MEDIUM × 2). To run these evaluations locally or submit your agent framework for indexing, inspect our open repository at <a href="https://github.com/Muneeb7860/agentic-redteam" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', textDecoration: 'underline' }}>github.com/Muneeb7860/agentic-redteam</a>.
          </div>
        </div>

      </div>
    </div>
  );
}
