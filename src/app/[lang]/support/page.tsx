'use client';
import React, { useState } from 'react';
import en from '../../../dictionaries/en.json';
import ar from '../../../dictionaries/ar.json';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const dictionaries: Record<string, typeof en> = { en, ar };

export default function SupportPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(props.params);
  const dict = dictionaries[lang] || en;
  const t = dict.supportPage || en.supportPage;
  const isRtl = lang === 'ar';

  const [activeChannel, setActiveChannel] = useState<'web' | 'api' | 'audit_desk' | 'slack' | 'email'>('web');
  const [category, setCategory] = useState<'bug' | 'feature_request' | 'security_incident' | 'general'>('general');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ticketResult, setTicketResult] = useState<{
    ticketId: string;
    priority: string;
    sla: string;
    sentiment: string;
    automatedReply: string;
  } | null>(null);

  const [blockedResult, setBlockedResult] = useState<{
    status: string;
    error: string;
    response: string;
    reason?: string;
  } | null>(null);

  // Ticket Lookup state
  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    ticketId: string;
    status: string;
    priority: string;
    sla: string;
    automatedReply: string;
  } | null>(null);

  useScrollReveal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          channel: activeChannel,
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTicketResult({
          ticketId: data.ticketId,
          priority: data.priority,
          sla: data.sla,
          sentiment: data.sentiment,
          automatedReply: data.automatedReply,
        });
        setBlockedResult(null);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setTicketResult(null);
        setBlockedResult({
          status: data.status || 'blocked',
          error: data.error || 'Security Enforcement Block: Threat pattern detected.',
          response: data.response || 'Request blocked due to security guardrail violation.',
          reason: data.risk?.reason || data.schema_validation?.reason || 'Guardrail Pre-Execution Block',
        });
      }
    } catch (err) {
      console.error('Support submission error:', err);
      setTicketResult(null);
      setBlockedResult({
        status: 'error',
        error: 'Network connection or execution error.',
        response: 'Unable to communicate with SwishOS security gateway.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookupLoading(true);
    try {
      const res = await fetch(`/api/support?ticketId=${encodeURIComponent(lookupId.trim())}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setLookupResult(data.ticket);
      }
    } catch (err) {
      console.error('Ticket lookup error:', err);
    } finally {
      setLookupLoading(false);
    }
  };

  const webhookCurlSnippet = `curl -X POST https://swishos.io/api/support \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "api",
    "category": "security_incident",
    "name": "Security Lead",
    "email": "sec-ops@company.com",
    "subject": "Guardrail evaluation log trace",
    "message": "Adversarial bypass trace detected on endpoint."
  }'`;

  const copyWebhookSnippet = () => {
    navigator.clipboard.writeText(webhookCurlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const channelIcons: Record<string, string> = {
    web: '🌐',
    api: '⚡',
    audit_desk: '🛡️',
    slack: '💬',
    email: '📧',
  };

  const categoryIcons: Record<string, string> = {
    bug: '🐛',
    feature_request: '✨',
    security_incident: '🚨',
    general: '💬',
  };

  return (
    <div className={`min-h-screen bg-[#030712] relative overflow-hidden text-white pt-28 pb-24 ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-5 max-w-3xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400 leading-tight tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Deep Insights Telemetry Panel */}
        <div className="scroll-reveal space-y-6">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <span className="text-emerald-400">⚡</span> {t.insightsTitle}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.insightsSubtitle}</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold tracking-wider flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE STREAM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
            
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all duration-300 backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>⚡</span> {t.slaLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.slaMetric}</div>
              </div>
              <div className="mt-6 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[95%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/80 hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-all duration-300 backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>🎯</span> {t.resolutionLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.resolutionMetric}</div>
              </div>
              <div className="mt-6 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[98%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/80 hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all duration-300 backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>⭐</span> {t.satisfactionLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.satisfactionMetric}</div>
              </div>
              <div className="mt-6 w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full w-[98%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/80 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] transition-all duration-300 backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>📡</span> {t.activeChannelsLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.activeChannelsMetric}</div>
              </div>
              <div className="mt-6 flex gap-1.5">
                {['web', 'api', 'audit', 'slack', 'mail'].map((_, idx) => (
                  <span key={idx} className="flex-1 bg-amber-400/20 border border-amber-400/40 h-2 rounded-full" />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Supported Open-Source Integration Connectors */}
        <div className="scroll-reveal space-y-6 pt-2">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <span className="text-purple-400">🔗</span> {t.openSourceStack.title}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.openSourceStack.subtitle}</p>
            </div>
            <a
              href="https://github.com/chatwoot/chatwoot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-2 shadow-md hover:shadow-purple-500/10"
            >
              <span>View Open-Source Connectors</span>
              <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
            <a
              href="https://github.com/chatwoot/chatwoot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800 hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all duration-300 group block backdrop-blur-2xl flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-white group-hover:text-purple-400 transition-colors">Chatwoot</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {t.openSourceStack.chatwootBadge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t.openSourceStack.chatwootDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                <span>{t.openSourceStack.chatwootTag || 'External Connector'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            <a
              href="https://github.com/freescout-helpdesk/freescout"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all duration-300 group block backdrop-blur-2xl flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">FreeScout</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {t.openSourceStack.freescoutBadge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t.openSourceStack.freescoutDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span>{t.openSourceStack.freescoutTag || 'External Connector'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            <a
              href="https://github.com/zammad/zammad"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-all duration-300 group block backdrop-blur-2xl flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">Zammad</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {t.openSourceStack.zammadBadge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t.openSourceStack.zammadDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                <span>{t.openSourceStack.zammadTag || 'External Connector'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>

            <a
              href="https://github.com/papercups-io/papercups"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] transition-all duration-300 group block backdrop-blur-2xl flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">Papercups</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {t.openSourceStack.papercupsBadge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t.openSourceStack.papercupsDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                <span>{t.openSourceStack.papercupsTag || 'External Connector'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          </div>

          {/* Webhook Payload Generator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>💻</span> {t.openSourceStack.webhookTitle}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">{t.openSourceStack.webhookDesc}</p>
              </div>
              <button
                onClick={copyWebhookSnippet}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all border border-slate-700 shadow-md cursor-pointer"
              >
                {copied ? 'Copied!' : t.openSourceStack.copyBtn}
              </button>
            </div>
            <pre className="p-5 rounded-2xl bg-black/95 border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
              {webhookCurlSnippet}
            </pre>
          </div>
        </div>

        {/* Omni-Channel Feedback Form & Ticket Tracker Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start scroll-reveal">
          
          {/* Main Form */}
          <div className="lg:col-span-7 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-9 backdrop-blur-2xl shadow-2xl space-y-7">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t.form.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5">{t.form.subtitle}</p>
            </div>

            {/* Channel Selection Buttons Grid (5 Columns on Desktop) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.form.channelLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {(['web', 'api', 'audit_desk', 'slack', 'email'] as const).map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setActiveChannel(ch)}
                    className={`h-12 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-2 text-center shadow-md cursor-pointer ${
                      activeChannel === ch
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/20'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{channelIcons[ch]}</span>
                    <span className="truncate">{t.channels[ch]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection Buttons Grid (4 Columns on Desktop) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t.form.categoryLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(['bug', 'feature_request', 'security_incident', 'general'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`h-12 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-2 text-center shadow-md cursor-pointer ${
                      category === cat
                        ? cat === 'security_incident'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/15 ring-2 ring-rose-500/20'
                          : 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500/20'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{categoryIcons[cat]}</span>
                    <span className="truncate">{t.categories[cat]}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.form.nameLabel}</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder={t.form.namePlaceholder}
                    className="w-full max-w-full min-w-0 h-12 bg-slate-950/90 border border-slate-800 rounded-xl px-4.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.form.emailLabel}</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder={t.form.emailPlaceholder}
                    className="w-full max-w-full min-w-0 h-12 bg-slate-950/90 border border-slate-800 rounded-xl px-4.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.form.subjectLabel}</label>
                <input
                  type="text"
                  required
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder={t.form.subjectPlaceholder}
                  className="w-full max-w-full min-w-0 h-12 bg-slate-950/90 border border-slate-800 rounded-xl px-4.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.form.messageLabel}</label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  placeholder={t.form.messagePlaceholder}
                  className="w-full max-w-full min-w-0 p-4 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✨</span>
                <span>{loading ? t.form.submitting : t.form.submitButton}</span>
              </button>
            </form>

            {/* Instant Triage Output Display (Allowed Response) */}
            {ticketResult && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950/90 border border-emerald-500/50 space-y-4 animate-fade-in shadow-2xl shadow-emerald-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {t.form.successTitle}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    {ticketResult.ticketId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Priority SLA:</span>
                    <p className="font-semibold text-white mt-0.5">{ticketResult.priority}</p>
                  </div>
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Target:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{ticketResult.sla}</p>
                  </div>
                </div>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-inner">
                  <strong className="text-emerald-400 block mb-1">AI Triage Response:</strong>
                  {ticketResult.automatedReply}
                </div>
              </div>
            )}

            {/* Blocked / Security Enforcement Display (HTTP 422 / 400 / 500 Response) */}
            {blockedResult && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-slate-950/90 border border-rose-500/60 space-y-4 animate-fade-in shadow-2xl shadow-rose-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <span>🛑</span> SECURITY ENFORCEMENT BLOCK
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                    {blockedResult.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-rose-200 font-semibold">{blockedResult.error}</p>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono shadow-inner">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Response Detail:</span>
                  {blockedResult.response}
                </div>
                {blockedResult.reason && (
                  <div className="text-[11px] text-rose-300/80 italic">
                    Reason: {blockedResult.reason}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ticket Tracker Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔎</span> {t.tracker.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{t.tracker.subtitle}</p>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2.5">
                <input
                  type="text"
                  value={lookupId}
                  onChange={e => setLookupId(e.target.value)}
                  placeholder={t.tracker.inputPlaceholder}
                  className="flex-1 h-12 bg-slate-950/90 border border-slate-800 rounded-xl px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/70 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  {t.tracker.lookupBtn}
                </button>
              </form>

              {/* Sample Ticket Shortcut */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setLookupId('TK-2026-8812');
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-slate-950/90 border border-slate-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-all font-mono text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>⚡</span>
                  <span>{t.tracker.sampleBtn}</span>
                </button>
              </div>

              {lookupResult && (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3.5 text-xs shadow-inner">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                    <span className="font-mono text-blue-400 font-bold">{lookupResult.ticketId}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-500/30">
                      {lookupResult.status}
                    </span>
                  </div>
                  <div className="text-slate-300 pt-1">
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{t.tracker.priorityLabel}</p>
                    <p className="font-medium text-white mt-0.5">{lookupResult.priority} ({lookupResult.sla})</p>
                  </div>
                  <div className="text-slate-300 pt-1">
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{t.tracker.aiReplyLabel}</p>
                    <p className="text-slate-300 leading-relaxed mt-1">{lookupResult.automatedReply}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Omni-Channel Direct Contacts */}
            <div className="bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Direct Omni-Channel Contacts
              </h4>

              <div className="space-y-3.5">
                <a
                  href="mailto:hello@swishos.io"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📧</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Direct Email</div>
                      <div className="text-slate-400 text-[11px]">hello@swishos.io</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">→</span>
                </a>

                <a
                  href="https://github.com/Muneeb7860/agentic-redteam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 transition-all text-xs group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🐙</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-400 transition-colors">SwishOS Open Source Harness (Public GitHub)</div>
                      <div className="text-slate-400 text-[11px]">github.com/Muneeb7860/agentic-redteam</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">→</span>
                </a>

                <a
                  href={`/${lang}/contact`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all text-xs group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">Security Audit Booking</div>
                      <div className="text-slate-400 text-[11px]">Schedule executive briefing</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">→</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
