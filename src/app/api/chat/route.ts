import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are the SwishOS AI Assistant — a sharp, concise B2B supply chain advisor.

SwishOS is a unified, AI-native platform for B2B supply chain and quick commerce. It delivers:
- Agentic inventory management & warehouse automation
- AI-native workflow engine with guardrails and custom agents
- Cloud-native, multi-region security architecture
- Compliance, billing automation and operational intelligence
- Brand enablement and strategic staffing services

Help potential clients understand how SwishOS solves logistics, supply chain, and quick-commerce challenges.
Keep responses to 2-4 sentences max. Be direct and confident. 
If asked about pricing or demos, say: "Book a call via our Contact page and our team will walk you through it."
Never mention competitors by name. Always represent SwishOS professionally.`;

// Context-aware static fallbacks when no API key is set
function smartFallback(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('price') || m.includes('cost') || m.includes('pricing'))
    return "SwishOS pricing is tailored to your order volume and service mix. Book a demo via our Contact page and we'll put together a custom proposal within 24 hours.";
  if (m.includes('demo') || m.includes('trial') || m.includes('test'))
    return "Absolutely — head to our Contact page and our team will schedule a personalised walkthrough of the SwishOS platform within 24 hours.";
  if (m.includes('integrat') || m.includes('erp') || m.includes('api'))
    return "SwishOS integrates natively with major ERPs (SAP, Oracle, Zoho) and exposes a full REST API for custom integrations. Setup typically takes under a week.";
  if (m.includes('inventory') || m.includes('stock') || m.includes('warehouse'))
    return "SwishOS provides real-time inventory intelligence across all your dark stores and warehouses — with AI agents that autonomously resolve short-ships and overstock situations.";
  if (m.includes('arabic') || m.includes('rtl') || m.includes('language'))
    return "SwishOS supports Arabic and English out of the box, with full RTL interface and localised reporting for GCC markets.";
  return "SwishOS is the AI-native operating system for B2B supply chains. I'm here to help — ask me about features, integrations, or how we handle your specific logistics challenges.";
}

export async function GET() {
  return NextResponse.json({ status: 'online', agent: 'SwishOS AI Assistant' });
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    // No API key → smart fallback (never breaks UX)
    if (!groqKey) {
      return NextResponse.json({ reply: smartFallback(message) });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message.trim() },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Groq error:', response.status, await response.text());
      return NextResponse.json({ reply: smartFallback(message) });
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim() || smartFallback(message);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({
      reply: "I'm having a brief moment — please try again or reach out via the Contact page!"
    });
  }
}
