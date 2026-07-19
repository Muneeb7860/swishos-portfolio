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
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Support submission error:', err);
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
    "name": "DevOps Engineer",
    "email": "security@company.com",
    "subject": "Red-team telemetry report",
    "message": "Elevated vulnerability trace detected on LLM endpoint."
  }'`;

  const copyWebhookSnippet = () => {
    navigator.clipboard.writeText(webhookCurlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-[#0A0D14] text-white pt-24 pb-20 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400 leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Deep Insights Telemetry Panel */}
        <div className="scroll-reveal space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> {t.insightsTitle}
            </h2>
            <p className="text-slate-400 text-sm">{t.insightsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Response SLA
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{t.slaMetric}</div>
              <div className="text-xs text-slate-400">{t.slaLabel}</div>
              <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[95%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-all shadow-xl">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                First-Touch Resolution
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{t.resolutionMetric}</div>
              <div className="text-xs text-slate-400">{t.resolutionLabel}</div>
              <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[99%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-all shadow-xl">
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                CSAT Rating
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{t.satisfactionMetric}</div>
              <div className="text-xs text-slate-400">{t.satisfactionLabel}</div>
              <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full w-[98%]" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Active Channels
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{t.activeChannelsMetric}</div>
              <div className="text-xs text-slate-400">{t.activeChannelsLabel}</div>
              <div className="mt-4 flex gap-1">
                {['web', 'api', 'audit', 'slack', 'mail'].map((ch, idx) => (
                  <span key={idx} className="flex-1 bg-amber-400/20 border border-amber-400/30 h-1.5 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Open-Source Support Stack Showcase */}
        <div className="scroll-reveal space-y-6 pt-4">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">🐙</span> {t.openSourceStack.title}
              </h2>
              <p className="text-slate-400 text-sm">{t.openSourceStack.subtitle}</p>
            </div>
            <a
              href="https://github.com/chatwoot/chatwoot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-2"
            >
              <span>Explore GitHub Repos</span>
              <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="https://github.com/chatwoot/chatwoot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white group-hover:text-purple-400 transition-colors">Chatwoot</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {t.openSourceStack.chatwootBadge}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {t.openSourceStack.chatwootDesc}
              </p>
            </a>

            <a
              href="https://github.com/freescout-helpdesk/freescout"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">FreeScout</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t.openSourceStack.freescoutBadge}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {t.openSourceStack.freescoutDesc}
              </p>
            </a>

            <a
              href="https://github.com/zammad/zammad"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white group-hover:text-blue-400 transition-colors">Zammad</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {t.openSourceStack.zammadBadge}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {t.openSourceStack.zammadDesc}
              </p>
            </a>

            <a
              href="https://github.com/papercups-io/papercups"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white group-hover:text-amber-400 transition-colors">Papercups</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t.openSourceStack.papercupsBadge}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {t.openSourceStack.papercupsDesc}
              </p>
            </a>
          </div>

          {/* Webhook Payload Generator */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>💻</span> {t.openSourceStack.webhookTitle}
              </span>
              <button
                onClick={copyWebhookSnippet}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all"
              >
                {copied ? 'Copied!' : t.openSourceStack.copyBtn}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black/80 border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto">
              {webhookCurlSnippet}
            </pre>
          </div>
        </div>

        {/* Omni-Channel Feedback Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 scroll-reveal">
          
          {/* Main Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">{t.form.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{t.form.subtitle}</p>
            </div>

            {/* Channel Selection Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t.form.channelLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['web', 'api', 'audit_desk', 'slack', 'email'] as const).map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setActiveChannel(ch)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between ${
                      activeChannel === ch
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{t.channels[ch]}</span>
                    {activeChannel === ch && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t.form.categoryLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(['bug', 'feature_request', 'security_incident', 'general'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      category === cat
                        ? cat === 'security_incident'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t.categories[cat]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.nameLabel}</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder={t.form.namePlaceholder}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.emailLabel}</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder={t.form.emailPlaceholder}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.subjectLabel}</label>
                <input
                  type="text"
                  required
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder={t.form.subjectPlaceholder}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.messageLabel}</label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  placeholder={t.form.messagePlaceholder}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {loading ? t.form.submitting : t.form.submitButton}
              </button>
            </form>

            {/* Instant Triage Output Display */}
            {ticketResult && (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {t.form.successTitle}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    {ticketResult.ticketId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Priority SLA:</span>
                    <p className="font-semibold text-white mt-0.5">{ticketResult.priority}</p>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Assigned Target:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{ticketResult.sla}</p>
                  </div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">AI Triage Response:</strong>
                  {ticketResult.automatedReply}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Tracker Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🔎</span> {t.tracker.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{t.tracker.subtitle}</p>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  type="text"
                  value={lookupId}
                  onChange={e => setLookupId(e.target.value)}
                  placeholder={t.tracker.inputPlaceholder}
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  {t.tracker.lookupBtn}
                </button>
              </form>

              {/* Sample Ticket Shortcuts */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Try example:</span>
                <button
                  type="button"
                  onClick={() => setLookupId('TK-2026-8812')}
                  className="text-blue-400 hover:underline font-mono"
                >
                  TK-2026-8812
                </button>
              </div>

              {lookupResult && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-mono text-blue-400 font-bold">{lookupResult.ticketId}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                      {lookupResult.status}
                    </span>
                  </div>
                  <div className="text-slate-300 pt-1">
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{t.tracker.priorityLabel}</p>
                    <p className="font-medium text-white">{lookupResult.priority} ({lookupResult.sla})</p>
                  </div>
                  <div className="text-slate-300 pt-1">
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{t.tracker.aiReplyLabel}</p>
                    <p className="text-slate-300 leading-relaxed mt-0.5">{lookupResult.automatedReply}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Omni-Channel Direct Contacts */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Direct Omni-Channel Contacts
              </h4>

              <div className="space-y-3">
                <a
                  href="mailto:hello@swishos.io"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-emerald-500/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📧</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-emerald-400">Direct Email</div>
                      <div className="text-slate-400 text-[11px]">hello@swishos.io</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                </a>

                <a
                  href="https://github.com/Muneeb7860/agentic-redteam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-purple-500/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🐙</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-400">GitHub Open Source Repo</div>
                      <div className="text-slate-400 text-[11px]">Muneeb7860/agentic-redteam</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-purple-400">→</span>
                </a>

                <a
                  href={`/${lang}/contact`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-amber-500/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-amber-400">Security Audit Booking</div>
                      <div className="text-slate-400 text-[11px]">Schedule executive briefing</div>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-amber-400">→</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
