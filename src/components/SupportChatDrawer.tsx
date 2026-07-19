'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
}

export function SupportChatDrawer({ lang = 'en' }: { lang?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isRtl = lang === 'ar';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: lang === 'ar'
        ? 'مرحباً بك! أنا مساعد أمن الذكاء الاصطناعي من SwishOS. كيف يمكنني مساعدتك في اختبار الاختراق وحواجز الحماية اليوم؟'
        : 'Welcome! I am your SwishOS AI Security Assistant. How can I help you with agent red-teaming, guardrail rules, or SLA triage today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Live Chat Visitor',
          email: 'live-chat@swishos.io',
          channel: 'web',
          category: /audit|book|pricing/i.test(query) ? 'general' : /vulnerability|jailbreak|threat|exploit/i.test(query) ? 'security_incident' : 'bug',
          subject: 'Live Chat Support Query',
          message: query,
        }),
      });

      const data = await res.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.automatedReply || (lang === 'ar' ? 'تم استلام طلبك وتصنيفه بنجاح.' : 'Your request has been triaged and dispatched.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: data.ticketId ? `Ticket: ${data.ticketId} (${data.sla})` : undefined,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Support chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickPills = lang === 'ar'
    ? [
        { label: '🛡️ احجز تدقيقاً أمنياً', query: 'أود حجز تدقيق أمني لوكلاء الذكاء الاصطناعي.' },
        { label: '⚡ الإبلاغ عن ثغرة حماية', query: 'أود الإبلاغ عن ثغرة أمنية أو تجاوز لحاجز الحماية.' },
        { label: '🔍 الاستعلام عن اتفاقية SLA', query: 'ما هي اتفاقيات مستوى الخدمة (SLA) للاستجابة؟' },
      ]
    : [
        { label: '🛡️ Book Security Audit', query: 'I want to book an AI Agent Security Audit.' },
        { label: '⚡ Report Guardrail Bypass', query: 'I want to report a guardrail vulnerability or threat.' },
        { label: '🔍 Check Response SLA', query: 'What are the response SLA parameters for security tickets?' },
      ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle Live Support Chat"
        className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-semibold text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all active:scale-95 border border-emerald-400/40`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
        <span>{isOpen ? (lang === 'ar' ? 'إغلاق المحادثة' : 'Close Chat') : (lang === 'ar' ? 'الدعم المباشر AI' : 'Live Support AI')}</span>
      </button>

      {/* Slide-Out Chat Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-20 ${isRtl ? 'left-6' : 'right-6'} z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-[#0A0D14]/95 border border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in ${isRtl ? 'rtl' : 'ltr'}`}
        >
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm font-bold">
                🛡️
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">
                  {lang === 'ar' ? 'مساعد SwishOS الأمني' : 'SwishOS Security AI'}
                </h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'ar' ? 'متصل الآن · استجابة فوريّة' : 'Online · Instant Triage'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-base px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                  {msg.actionTag && (
                    <div className="mt-2 pt-1.5 border-t border-emerald-400/30 text-[10px] font-mono text-emerald-300 font-semibold">
                      {msg.actionTag}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{lang === 'ar' ? 'جاري التحليل والتصنيف...' : 'Triaging security request...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white transition-all flex-shrink-0"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your security query...'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-40"
            >
              {lang === 'ar' ? 'إرسال' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
