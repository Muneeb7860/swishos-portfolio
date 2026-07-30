'use client';

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, ExternalLink, CheckCircle2, Eye, XCircle } from 'lucide-react';

interface ThreatIncident {
  title: string;
  url: string;
  source: string;
  published: string;
  severity: string;
  swishos_coverage: string;
  coverage_note: string;
  snippet: string;
}

interface ThreatFeed {
  generated_at: string;
  total_incidents: number;
  coverage_summary: {
    blocked: number;
    detects: number;
    gap: number;
    review: number;
  };
  incidents: ThreatIncident[];
}

const COVERAGE_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  blocked: {
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    icon: <CheckCircle2 size={12} />,
    label: 'Blocked',
  },
  detects: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    icon: <Eye size={12} />,
    label: 'Detects',
  },
  gap: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    icon: <XCircle size={12} />,
    label: 'Open Gap',
  },
  review: {
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.1)',
    icon: <AlertTriangle size={12} />,
    label: 'Under Review',
  },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#6b7280',
};

export function LiveThreatFeed() {
  const [feed, setFeed] = useState<ThreatFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/threat-feed.json')
      .then((res) => {
        if (!res.ok) throw new Error('Feed not available');
        return res.json();
      })
      .then((data) => setFeed(data))
      .catch(() => setFeed(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
        Loading threat intelligence...
      </div>
    );
  }

  if (!feed || feed.incidents.length === 0) {
    return null; // Don't render anything if no feed data
  }

  const lastUpdated = new Date(feed.generated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section style={{ marginTop: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Shield size={18} style={{ color: 'var(--brand)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Live AI Agent Threat Intelligence
            </h3>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Live
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
            Real-world AI agent security incidents — updated nightly. Last scan: {lastUpdated}
          </p>
        </div>

        {/* Coverage Summary Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {feed.coverage_summary.blocked > 0 && (
            <span style={{ ...pillStyle, background: COVERAGE_STYLES.blocked.bg, color: COVERAGE_STYLES.blocked.color }}>
              {COVERAGE_STYLES.blocked.icon} {feed.coverage_summary.blocked} Blocked
            </span>
          )}
          {feed.coverage_summary.detects > 0 && (
            <span style={{ ...pillStyle, background: COVERAGE_STYLES.detects.bg, color: COVERAGE_STYLES.detects.color }}>
              {COVERAGE_STYLES.detects.icon} {feed.coverage_summary.detects} Detects
            </span>
          )}
          {feed.coverage_summary.gap > 0 && (
            <span style={{ ...pillStyle, background: COVERAGE_STYLES.gap.bg, color: COVERAGE_STYLES.gap.color }}>
              {COVERAGE_STYLES.gap.icon} {feed.coverage_summary.gap} Gap
            </span>
          )}
        </div>
      </div>

      {/* Incident Cards */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {feed.incidents.map((incident, idx) => {
          const coverage = COVERAGE_STYLES[incident.swishos_coverage] || COVERAGE_STYLES.review;
          const severityColor = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.low;

          return (
            <a
              key={idx}
              href={incident.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '16px 20px',
                background: 'var(--card-bg)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${severityColor}20`,
                      color: severityColor,
                      textTransform: 'uppercase',
                    }}>
                      {incident.severity}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                      {incident.title}
                    </h4>
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                    <span>{incident.source}</span>
                    {incident.published && <span>{incident.published}</span>}
                  </div>
                </div>

                {/* Coverage badge */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: coverage.bg,
                    color: coverage.color,
                    border: `1px solid ${coverage.color}30`,
                    whiteSpace: 'nowrap',
                  }}>
                    {coverage.icon} SwishOS: {coverage.label}
                  </span>
                  <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
                </div>
              </div>

              {/* Coverage note */}
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                {incident.coverage_note}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 700,
};
