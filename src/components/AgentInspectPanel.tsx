'use client';

import type { TrustNode } from '@/app/api/trust-graph/route';

interface AgentInspectPanelProps {
  node: TrustNode | null;
  onClose: () => void;
}

const TRUST_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  trusted:  { bg: 'rgba(34,197,94,0.15)',  text: '#22c55e', label: '✓ TRUSTED'  },
  degraded: { bg: 'rgba(249,115,22,0.15)', text: '#f97316', label: '⚠ DEGRADED' },
  blocked:  { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', label: '✗ BLOCKED'  },
};

export default function AgentInspectPanel({ node, onClose }: AgentInspectPanelProps) {
  const visible = !!node;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '340px',
        background: 'rgba(15,23,42,0.97)',
        borderLeft: '1px solid #1e293b',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Agent Inspector
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      {node && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Agent Name */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{node.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{node.id}</div>
          </div>

          {/* Trust Status */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Trust Status</div>
            <span style={{
              background: TRUST_BADGE[node.trustLevel].bg,
              color: TRUST_BADGE[node.trustLevel].text,
              border: `1px solid ${TRUST_BADGE[node.trustLevel].text}`,
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              {TRUST_BADGE[node.trustLevel].label}
            </span>
          </div>

          {/* mTLS Status */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>mTLS Certificate</div>
            <span style={{
              background: node.mtlsValid ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: node.mtlsValid ? '#22c55e' : '#ef4444',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {node.mtlsValid ? '🔒 Valid & Pinned' : '⚠ Not Present'}
            </span>
          </div>

          {/* Spend Cap */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Spend Cap Remaining
            </div>
            <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round(node.spendCapRemaining * 100)}%`,
                background: node.spendCapRemaining > 0.5 ? '#22c55e' : node.spendCapRemaining > 0.2 ? '#f97316' : '#ef4444',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              {Math.round(node.spendCapRemaining * 100)}% of daily budget remaining
            </div>
          </div>

          {/* Audit Events */}
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Recent Audit Events
            </div>
            {node.auditEvents.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#475569' }}>No events recorded.</div>
            ) : (
              node.auditEvents.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    background: ev.blocked ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.04)',
                    border: `1px solid ${ev.blocked ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.15)'}`,
                    borderRadius: '6px',
                    padding: '10px 12px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: ev.blocked ? '#ef4444' : '#22c55e',
                      textTransform: 'uppercase',
                    }}>
                      {ev.blocked ? '✗ BLOCKED' : '✓ ALLOWED'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#475569' }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {ev.blocked && (
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#f97316', marginBottom: '2px' }}>
                      {ev.ruleTriggered}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-word' }}>
                    {ev.payload}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Last Seen */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e293b', fontSize: '11px', color: '#475569' }}>
            Last seen: {new Date(node.lastSeen).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
