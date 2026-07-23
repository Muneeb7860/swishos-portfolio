'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AgentInspectPanel from '@/components/AgentInspectPanel';
import type { TrustNode, TrustEdge } from '@/app/api/trust-graph/route';

// Dynamically import TrustGraph to skip SSR (D3 requires browser APIs)
const TrustGraph = dynamic(() => import('@/components/TrustGraph'), { ssr: false });

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
      // Swallow fetch errors — keep last known graph state
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020817 0%, #0f172a 50%, #020817 100%)',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid #1e293b',
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🕸️</span>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Multi-Agent Trust Graph
            </h1>
            <span style={{
              background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.3)',
              color: '#38bdf8',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
            }}>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Zero-Trust Inter-Agent Call Chain Topology · Updated every 3s
            {lastUpdated && <span> · Last: {lastUpdated}</span>}
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: 'Trusted',  value: trustedCount,  color: '#22c55e' },
            { label: 'Degraded', value: degradedCount, color: '#f97316' },
            { label: 'Blocked',  value: blockedCount,  color: '#ef4444' },
            { label: 'Blocked Hops', value: blockedEdges, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 32px', background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid #0f172a', display: 'flex', gap: '24px', fontSize: '11px', color: '#64748b' }}>
        <span>🔀 Orchestrator</span>
        <span>🤖 Worker Agent</span>
        <span>🌐 External Client</span>
        <span>⚠️ Compromised/Unknown</span>
        <span style={{ color: '#22c55e' }}>── Trusted hop</span>
        <span style={{ color: '#ef4444' }}>╌╌ Blocked hop</span>
        <span style={{ color: '#38bdf8' }}>🔒 mTLS verified</span>
      </div>

      {/* Graph Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #1e293b', borderTop: '3px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: '#475569', fontSize: '14px' }}>Loading agent topology…</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : graphData ? (
          <>
            <TrustGraph
              nodes={graphData.nodes}
              edges={graphData.edges}
              onNodeSelect={setSelectedNode}
              selectedNodeId={selectedNode?.id}
            />
            <AgentInspectPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
            {/* Click hint */}
            {!selectedNode && (
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                color: '#64748b',
                pointerEvents: 'none',
              }}>
                Click any node to inspect agent trust posture
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ef4444' }}>
            Failed to load trust graph data.
          </div>
        )}
      </div>
    </div>
  );
}
