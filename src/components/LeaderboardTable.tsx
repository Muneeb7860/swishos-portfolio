'use client';

import React, { useState } from 'react';
import { BENCHMARK_DATA, type FrameworkBenchmark } from '@/app/api/leaderboard/route';

interface LeaderboardTableProps {
  data?: FrameworkBenchmark[];
}

export function LeaderboardTable({ data = BENCHMARK_DATA }: LeaderboardTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('swishos-enclave');

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.ecosystem.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `swish-bench-leaderboard-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['Framework', 'Version', 'Ecosystem', 'OWASP Score', 'Grade', 'Pass Rate', 'Prompt Injection', 'WASM Isolation', 'Spend Caps', 'Memory Poisoning'];
    const rows = data.map(item => [
      `"${item.name}"`,
      `"${item.version}"`,
      `"${item.ecosystem}"`,
      item.owaspScore,
      item.grade,
      `"${item.passRate}%"`,
      `"${item.categories.promptInjection}%"`,
      `"${item.categories.wasmIsolation}%"`,
      `"${item.categories.spendCaps}%"`,
      `"${item.categories.memoryPoisoning}%"`,
    ]);

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(','), ...rows.map(e => e.join(','))].join('\n')}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `swish-bench-leaderboard-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Search & Export Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        background: '#0F172A',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search framework by name or ecosystem (e.g. LangChain, Python)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F8FAFC',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: '#1E293B',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#F8FAFC',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All OWASP & ASI Categories</option>
          <option value="promptInjection">Prompt Injection (LLM01)</option>
          <option value="wasmIsolation">WASM Isolation (ASI06)</option>
          <option value="spendCaps">Spend Caps (ASI10)</option>
          <option value="memoryPoisoning">Memory Poisoning (ASI08)</option>
        </select>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              background: '#334155',
              color: '#F8FAFC',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            style={{
              background: '#0284C7',
              color: '#F8FAFC',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📦 Export JSON
          </button>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#0F172A' }}>
          <thead>
            <tr style={{ background: '#1E293B', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <th style={{ padding: '14px 20px', fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>RANK / FRAMEWORK</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>VERSION</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>ECOSYSTEM</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 700, textAlign: 'center' }}>OWASP SCORE</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 700, textAlign: 'center' }}>GRADE</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 700, textAlign: 'center' }}>PASS RATE</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', color: '#94A3B8', fontWeight: 700, textAlign: 'right' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              const isNative = item.isNativeEnclave;

              return (
                <React.Fragment key={item.id}>
                  <tr style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: isNative ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                    transition: 'background 0.2s ease',
                  }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#10B981' : '#334155',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: isNative ? '#34D399' : '#F8FAFC' }}>
                            {item.name} {isNative && <span style={{ fontSize: '11px', background: '#10B981', color: '#000', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>NATIVE</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#94A3B8' }}>{item.version}</td>
                    <td style={{ padding: '16px 16px', fontSize: '13px', color: '#CBD5E1' }}>{item.ecosystem}</td>
                    <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: item.owaspScore >= 90 ? '#34D399' : item.owaspScore >= 75 ? '#FBBF24' : '#F87171',
                      }}>
                        {item.owaspScore}/100
                      </span>
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                      <span style={{
                        background: item.grade === 'A' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: item.grade === 'A' ? '#34D399' : '#F87171',
                        border: `1px solid ${item.grade === 'A' ? '#10B981' : '#EF4444'}`,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}>
                        {item.grade}
                      </span>
                    </td>
                    <td style={{ padding: '16px 16px', textAlign: 'center', fontWeight: 600, fontSize: '14px', color: '#F8FAFC' }}>
                      {item.passRate}% ({item.passedTests}/{item.totalTests})
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#94A3B8',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? 'Collapse ▲' : 'Breakdown ▼'}
                      </button>
                    </td>
                  </tr>

                  {/* Category Breakdown Drawer */}
                  {isExpanded && (
                    <tr style={{ background: '#090D16' }}>
                      <td colSpan={7} style={{ padding: '20px 24px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>
                          Threat Category Security Breakdown ({item.name})
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          {[
                            { name: 'Prompt Injection (LLM01)', score: item.categories.promptInjection },
                            { name: 'PII Redaction (LLM06)', score: item.categories.piiRedaction },
                            { name: 'WASM Sandbox (ASI06)', score: item.categories.wasmIsolation },
                            { name: 'Spend Caps (ASI10)', score: item.categories.spendCaps },
                            { name: 'AST Splitting (ASI01)', score: item.categories.astPayloadSplitting },
                            { name: 'Memory Poisoning (ASI08)', score: item.categories.memoryPoisoning },
                          ].map((cat) => (
                            <div key={cat.name} style={{ background: '#1E293B', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>{cat.name}</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ background: '#0F172A', borderRadius: '4px', height: '6px', flex: 1, marginRight: '10px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${cat.score}%`, background: cat.score >= 90 ? '#10B981' : cat.score >= 60 ? '#F59E0B' : '#EF4444' }} />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: cat.score >= 90 ? '#34D399' : '#F8FAFC' }}>{cat.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
