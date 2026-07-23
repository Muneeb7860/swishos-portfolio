'use client';

import { useState, useEffect, useCallback } from 'react';
import AgentInspectPanel from '@/components/AgentInspectPanel';
import type { TrustNode, TrustEdge } from '@/app/api/trust-graph/route';

const POLL_INTERVAL_MS = 3000;

interface TrustGraphData {
  nodes: TrustNode[];
  edges: TrustEdge[];
  generatedAt: string;
}

export default function TrustGraphPage() {
  const [graphData, setGraphData] = useState<TrustGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<TrustNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchGraph = useCallback(async () => {
    try {
      const res = await fetch('/api/trust-graph', { cache: 'no-store' });
      if (res.ok) {
        const data: TrustGraphData = await res.json();
        setGraphData(data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch {
      // Keep last known graph state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => { if (!cancelled) await fetchGraph(); };
    void run();
    return () => { cancelled = true; };
  }, [fetchGraph]);

  useEffect(() => {
    const interval = setInterval(() => void fetchGraph(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchGraph]);

  const trustedCount = graphData?.nodes.filter(n => n.trustLevel === 'trusted').length ?? 0;
  const degradedCount = graphData?.nodes.filter(n => n.trustLevel === 'degraded').length ?? 0;
  const blockedCount = graphData?.nodes.filter(n => n.trustLevel === 'blocked').length ?? 0;
  const blockedEdges = graphData?.edges.filter(e => e.blocked).length ?? 0;

  const handleExportJson = () => {
    if (!graphData) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graphData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `swishos-zero-trust-telemetry-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    if (!graphData) return;
    const headers = ['Agent ID', 'Label', 'Type', 'Trust Level', 'mTLS Valid', 'Spend Cap Remaining', 'Last Seen'];
    const rows = graphData.nodes.map(n => [
      n.id,
      `"${n.label}"`,
      n.type,
      n.trustLevel,
      n.mtlsValid ? 'TRUE' : 'FALSE',
      `${(n.spendCapRemaining * 100).toFixed(0)}%`,
      n.lastSeen,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `swishos-agent-audit-trail-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F17',
      color: '#F8FAFC',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Console Header */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>🛡️</span>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
                Multi-Agent Zero-Trust Telemetry Console
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10B981',
                color: '#34D399',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '6px',
                letterSpacing: '0.06em',
              }}>
                SOC2 TYPE II VERIFIED
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Real-time mTLS handshake monitoring, spend cap enforcement, and AST policy audit stream.
              {lastUpdated && <span> · Updated: {lastUpdated}</span>}
            </div>
          </div>

          {/* Export Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCsv}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: '#1E293B',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📥 Download CSV Audit Trail
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563EB, #0891B2)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              📄 Export JSON Evidence
            </button>
          </div>
        </div>

        {/* Operations Overview Metric Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total Monitored Agents</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC' }}>{graphData?.nodes.length ?? 0}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Active runtime enclaves</div>
          </div>

          <div style={{ background: '#0F172A', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Trusted Enclaves</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E' }}>{trustedCount}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>mTLS verified & compliant</div>
          </div>

          <div style={{ background: '#0F172A', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#FB923C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Degraded / Policy Alerts</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#F97316' }}>{degradedCount}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>ASI08 Memory provenance alert</div>
          </div>

          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Quarantined / Blocked Hops</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444' }}>{blockedCount + blockedEdges}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Adversarial & PII blocked calls</div>
          </div>
        </div>

        {/* Telemetry Registry Table */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🤖</span> Inter-Agent Zero-Trust Registry & Health
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>Click any agent record to inspect AST rules, mTLS certificates, and detailed audit events.</p>
            </div>
            <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              Deterministic Enclave Guardrails Active
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>Loading Telemetry Registry…</div>
          ) : graphData ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                    <th style={{ padding: '14px 16px' }}>Agent Identity</th>
                    <th style={{ padding: '14px 16px' }}>Role Type</th>
                    <th style={{ padding: '14px 16px' }}>mTLS State</th>
                    <th style={{ padding: '14px 16px' }}>Trust Posture</th>
                    <th style={{ padding: '14px 16px' }}>Spend Cap Remaining</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {graphData.nodes.map(node => (
                    <tr
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        background: selectedNode?.id === node.id ? '#1E293B' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '14px' }}>{node.label}</div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }}>{node.id}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#CBD5E1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          {node.type}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {node.mtlsValid ? (
                          <span style={{ color: '#34D399', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            🔒 mTLS Verified
                          </span>
                        ) : (
                          <span style={{ color: '#F87171', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            ❌ Failed / Untrusted
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {node.trustLevel === 'trusted' && (
                          <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            🟢 TRUSTED
                          </span>
                        )}
                        {node.trustLevel === 'degraded' && (
                          <span style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid #F97316', color: '#FB923C', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            🟠 DEGRADED (TAMPERING)
                          </span>
                        )}
                        {node.trustLevel === 'blocked' && (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#F87171', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            🔴 QUARANTINED
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px', minWidth: '180px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>
                          <span>Limit: ${(100 * node.spendCapRemaining).toFixed(0)}</span>
                          <span>{(node.spendCapRemaining * 100).toFixed(0)}% Left</span>
                        </div>
                        <div style={{ height: '8px', background: '#1E293B', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${node.spendCapRemaining * 100}%`,
                            background: node.spendCapRemaining > 0.5 ? '#10B981' : (node.spendCapRemaining > 0.2 ? '#F59E0B' : '#EF4444'),
                          }} />
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            background: 'rgba(56, 189, 248, 0.1)',
                            color: '#38BDF8',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Inspect Log →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {/* Live Incident & Audit Event Stream */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Real-Time Audit & Enforcement Feed
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {graphData?.nodes.flatMap(n => n.auditEvents.map(e => ({ ...e, agent: n.label, agentId: n.id }))).slice(0, 5).map((ev, idx) => (
              <div
                key={idx}
                style={{
                  background: ev.blocked ? 'rgba(239, 68, 68, 0.1)' : '#1E293B',
                  border: `1px solid ${ev.blocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>{ev.blocked ? '🛑' : '✓'}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: ev.blocked ? '#F87171' : '#34D399' }}>
                      {ev.blocked ? `BLOCKED: ${ev.ruleTriggered}` : 'PASSED: Zero-Trust AST Assertion Verified'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      Target: <strong>{ev.agent}</strong> ({ev.agentId}) · Payload: <code style={{ color: '#E2E8F0' }}>{ev.payload}</code>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }}>
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Inspection Drawer */}
        {selectedNode && (
          <AgentInspectPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

      </div>
    </div>
  );
}
