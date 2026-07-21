'use client';

import React, { useState } from 'react';

interface SpendGovernorWidgetProps {
  isAr?: boolean;
}

export function SpendGovernorWidget({ isAr = false }: SpendGovernorWidgetProps) {
  const [simulatedSpend, setSimulatedSpend] = useState<number>(14.5);
  const weeklyCap = 25.0;
  const isCapExceeded = simulatedSpend >= weeklyCap;
  const spendPercentage = Math.min(100, (simulatedSpend / weeklyCap) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            {isAr ? 'حاكم إمكانيات وإنفاق وكيل الذكاء الاصطناعي (WASI)' : 'AI Agent Spend & WASI Capability Governor'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr
              ? 'حماية الإنفاق التراكمي لمدة 30 يومًا وتقييد أذونات WASI لمنع استنزاف الميزانية'
              : 'Rolling 30-Day Spend Limits ($25/Week Cap) & WASI Capability Token Enforcement'}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold ${
            isCapExceeded
              ? 'bg-rose-950/80 border border-rose-500/50 text-rose-400'
              : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400'
          }`}
        >
          {isCapExceeded
            ? (isAr ? 'تم قفل الحاكم (تجاوز الحد)' : 'GOVERNOR LOCKED (CAP EXCEEDED)')
            : (isAr ? 'الحاكم نشط (آمن)' : 'GOVERNOR ACTIVE (SAFE)')}
        </div>
      </div>

      {/* Spend Meter */}
      <div className="my-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-neutral-400">
            {isAr ? 'الإنفاق التراكمي الحالي (أسبوعي)' : 'Rolling 7-Day Spend Progress'}
          </span>
          <span className="text-emerald-400 font-bold">
            ${simulatedSpend.toFixed(2)} / ${weeklyCap.toFixed(2)} USD
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-300 ${
              isCapExceeded
                ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                : spendPercentage > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
            }`}
            style={{ width: `${spendPercentage}%` }}
          ></div>
        </div>

        {/* Simulation Slider */}
        <div className="pt-3 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="spend-slider" className="text-xs text-neutral-400 font-mono">
            {isAr ? 'محاكاة زيادة إنفاق الوكيل:' : 'Simulate Agent Tool Spend ($):'}
          </label>
          <input
            id="spend-slider"
            type="range"
            min="0"
            max="35"
            step="0.5"
            value={simulatedSpend}
            onChange={(e) => setSimulatedSpend(parseFloat(e.target.value))}
            className="w-full sm:w-64 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* WASI Capability Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
            {isAr ? 'ملفات النظام' : 'Root Filesystem'}
          </div>
          <div className="text-sm font-bold text-emerald-400">READ-ONLY (Strict)</div>
          <div className="text-xs text-neutral-400 mt-1">
            {isAr ? 'يتم رفض أي محاولة كتابة' : 'Write operations blocked by default'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
            {isAr ? 'الوصول للشبكة' : 'Network Egress'}
          </div>
          <div className="text-sm font-bold text-emerald-400">SCOPED AGENT APIS</div>
          <div className="text-xs text-neutral-400 mt-1">
            {isAr ? 'حظر خروج البيانات غير المصرح بها' : 'Unapproved outbound sockets dropped'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
            {isAr ? 'توارث الصلاحيات' : 'Privilege Escalation'}
          </div>
          <div className="text-sm font-bold text-rose-400">DENIED (Zero Inherit)</div>
          <div className="text-xs text-neutral-400 mt-1">
            {isAr ? 'الوكلاء الفرعيون معزولون تمامًا' : 'Sub-agents possess zero parent rights'}
          </div>
        </div>
      </div>
    </div>
  );
}
