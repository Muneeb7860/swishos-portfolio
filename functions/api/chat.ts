// Cloudflare Pages Function: /api/chat
// Proxies to local Ollama (or any OpenAI-compatible endpoint)

interface Env {
  OLLAMA_BASE_URL?: string; // e.g. https://ollama.yourhomelab.com or http://localhost:11434
  OLLAMA_MODEL?: string;    // defaults to 'mistral'
}

const SYSTEM_PROMPT = `You are the SwishOS AI Assistant — a smart, concise B2B supply chain advisor built into the SwishOS platform.

SwishOS is a unified, AI-native platform for B2B supply chain and quick commerce. It provides:
- Smart inventory management & warehouse automation
- AI-native agentic layer with guardrails and custom workflows
- Cloud-native, multi-region security architecture
- Compliance, billing automation and operational support
- Brand enablement and strategic staffing services

You help potential clients understand how SwishOS can solve their logistics, supply chain and quick-commerce challenges. 
Be helpful, specific, and conversational. Keep responses concise (2-4 sentences max). 
If asked about pricing or demos, direct them to book a call via the Contact page.
Always be friendly and professional. You represent SwishOS.`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json() as { message: string };
    const userMessage = body.message?.trim();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400, headers });
    }

    const ollamaBase = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = env.OLLAMA_MODEL || 'mistral';

    const ollamaResponse = await fetch(`${ollamaBase}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      console.error('Ollama error:', errText);
      return new Response(JSON.stringify({ reply: "I'm experiencing a brief issue connecting to my AI backend. Please try again shortly, or reach out via the Contact page!" }), { status: 200, headers });
    }

    const data = await ollamaResponse.json() as { message: { content: string } };
    const reply = data?.message?.content || "I couldn't generate a response. Please try again!";

    return new Response(JSON.stringify({ reply }), { status: 200, headers });
  } catch (err) {
    console.error('Chat function error:', err);
    return new Response(JSON.stringify({ reply: "Something went wrong on my end. Please try the Contact form to reach our team directly!" }), { status: 200, headers });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
