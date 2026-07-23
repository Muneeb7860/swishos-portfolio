import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface CategoryBreakdown {
  promptInjection: number;    // 0-100%
  piiRedaction: number;       // 0-100%
  wasmIsolation: number;      // 0-100%
  spendCaps: number;          // 0-100%
  astPayloadSplitting: number; // 0-100%
  memoryPoisoning: number;    // 0-100%
  mtlsAuth: number;           // 0-100%
  rateLimiting: number;       // 0-100%
}

export interface FrameworkBenchmark {
  id: string;
  name: string;
  version: string;
  ecosystem: string;
  owaspScore: number;         // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passRate: number;           // 0-100%
  totalTests: number;
  passedTests: number;
  failedTests: number;
  categories: CategoryBreakdown;
  lastAudited: string;
  badgeUrl?: string;
  isNativeEnclave?: boolean;
}

export const BENCHMARK_DATA: FrameworkBenchmark[] = [
  {
    id: 'swishos-enclave',
    name: 'SwishOS Zero-Trust Enclave',
    version: 'v0.9.0 / v1.0.0',
    ecosystem: 'Rust / TypeScript / WASM',
    owaspScore: 100,
    grade: 'A',
    passRate: 100.0,
    totalTests: 250,
    passedTests: 250,
    failedTests: 0,
    isNativeEnclave: true,
    lastAudited: '2026-07-24T00:00:00Z',
    categories: {
      promptInjection: 100,
      piiRedaction: 100,
      wasmIsolation: 100,
      spendCaps: 100,
      astPayloadSplitting: 100,
      memoryPoisoning: 100,
      mtlsAuth: 100,
      rateLimiting: 100,
    },
  },
  {
    id: 'llamaindex-workflows',
    name: 'LlamaIndex Workflows',
    version: 'v0.11.0',
    ecosystem: 'Python / TypeScript',
    owaspScore: 76,
    grade: 'B',
    passRate: 76.0,
    totalTests: 250,
    passedTests: 190,
    failedTests: 60,
    lastAudited: '2026-07-20T00:00:00Z',
    categories: {
      promptInjection: 70,
      piiRedaction: 85,
      wasmIsolation: 0,
      spendCaps: 60,
      astPayloadSplitting: 72,
      memoryPoisoning: 90,
      mtlsAuth: 80,
      rateLimiting: 85,
    },
  },
  {
    id: 'crewai',
    name: 'CrewAI Multi-Agent',
    version: 'v0.70.0',
    ecosystem: 'Python',
    owaspScore: 72,
    grade: 'C',
    passRate: 72.0,
    totalTests: 250,
    passedTests: 180,
    failedTests: 70,
    lastAudited: '2026-07-21T00:00:00Z',
    categories: {
      promptInjection: 65,
      piiRedaction: 78,
      wasmIsolation: 0,
      spendCaps: 55,
      astPayloadSplitting: 68,
      memoryPoisoning: 82,
      mtlsAuth: 70,
      rateLimiting: 80,
    },
  },
  {
    id: 'langchain',
    name: 'LangChain / LangGraph',
    version: 'v0.3.15',
    ecosystem: 'Python / TypeScript',
    owaspScore: 68,
    grade: 'C',
    passRate: 68.0,
    totalTests: 250,
    passedTests: 170,
    failedTests: 80,
    lastAudited: '2026-07-19T00:00:00Z',
    categories: {
      promptInjection: 60,
      piiRedaction: 75,
      wasmIsolation: 0,
      spendCaps: 50,
      astPayloadSplitting: 62,
      memoryPoisoning: 78,
      mtlsAuth: 65,
      rateLimiting: 75,
    },
  },
  {
    id: 'autogen',
    name: 'Microsoft AutoGen',
    version: 'v0.4.0',
    ecosystem: 'Python',
    owaspScore: 64,
    grade: 'C',
    passRate: 64.0,
    totalTests: 250,
    passedTests: 160,
    failedTests: 90,
    lastAudited: '2026-07-18T00:00:00Z',
    categories: {
      promptInjection: 55,
      piiRedaction: 70,
      wasmIsolation: 0,
      spendCaps: 45,
      astPayloadSplitting: 58,
      memoryPoisoning: 75,
      mtlsAuth: 60,
      rateLimiting: 70,
    },
  },
];

export async function GET() {
  return NextResponse.json(
    {
      benchmark: 'swish-bench-v1',
      evaluatedFrameworksCount: BENCHMARK_DATA.length,
      totalPayloadsEvaluated: BENCHMARK_DATA.reduce((acc, item) => acc + item.totalTests, 0),
      data: BENCHMARK_DATA,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-SwishOS-Benchmark-Version': '1.2.0',
      },
    }
  );
}
