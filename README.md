# 🛡️ SwishOS Platform: Frontier-Grade Zero-Trust AI Agent Enclave

[![PyPI version](https://img.shields.io/badge/agentic--redteam-v0.5.0-blue.svg)](https://github.com/Muneeb7860/agentic-redteam)
[![CI/CD Security Gate](https://img.shields.io/badge/Security--Gate-100%25--PASS-emerald.svg)](https://github.com/Muneeb7860/swishos-portfolio/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![gVisor Virtual Kernel](https://img.shields.io/badge/gVisor-runsc--isolated-purple.svg)](docker-compose.production.yml)

SwishOS is an enterprise-grade, shift-left **Zero-Trust AI Agent Execution Enclave** designed to protect production LLM pipelines against prompt injections, multi-turn state drift, adversarial payload splitting, excessive agency, and out-of-band deception.

---

## 📐 Zero-Trust Enclave Architecture

```
[ INCOMING AGENTIC QUERY / MULTI-TURN PAYLOAD ]
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: SHIFT-LEFT INPUT NORMALIZATION & CENTROID CLASSIFIER                     │
│ • NFKC Unicode Normalization & Homoglyph Mapping (Cyrillic -> Latin)             │
│ • Sub-Word Character N-Gram Centroid Distance Classifier (0.25 Threshold)        │
│ • Multi-Turn Variable Concatenation AST Tracker (Detects 12-Turn Payload Splits)  │
└──────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: GLOBAL SUBNET TARPITTED RATE LIMITER & ZERO-INFO REFUSALS                │
│ • Global Client Fingerprinting (`Subnet IP + TLS User-Agent`)                    │
│ • Exponential Backoff Latency Tarpit (Traps session rotation in 4+ hr delays)    │
│ • Zero-Information Flat Refusals ($R=0$ Reward Poisoning for MCTS Search Trees)   │
└──────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: PRE-EXECUTION SHADOW SANDBOX PROBING & CRYPTOGRAPHIC PROOFS             │
│ • Pre-execution tool validation inside disposable shadow WASM sandbox             │
│ • Signed HMAC-SHA256 Audit Proof Headers (`X-SwishOS-Audit-Proof`)               │
└──────────────────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: ENCLAVE EXECUTION (Ed25519 / WASI Tokens / gVisor `runsc` Kernel)        │
│ • Ed25519 / HMAC-SHA256 Inter-Agent Signed Headers                              │
│ • WASI Single-Capability Tokens (Zero privilege inheritance for sub-agents)     │
│ • gVisor (`runsc`) user-space Go virtualized kernel isolation                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Open-Source Security Benchmark Matrix (v0.5.0)

Evaluated against the [`agentic-redteam`](https://github.com/Muneeb7860/agentic-redteam) v0.5.0 benchmark suite:

| Threat Category | SwishOS v0.5.0 Defense Pass Rate | Attack Latency Multiplier | Bypass Risk |
| :--- | :---: | :---: | :---: |
| **Action Level Overreach** | **100.0%** (5/5) | 1.0x | 🟢 **ZERO** |
| **Centroid Novel Metaphors** | **100.0%** (5/5) | 10.0x Tarpit | 🟢 **ZERO** |
| **Code Safety & Escapes** | **100.0%** (5/5) | 1.0x | 🟢 **ZERO** |
| **Indirect Injection** | **100.0%** (5/5) | 1.0x | 🟢 **ZERO** |
| **Jailbreak Framing** | **100.0%** (5/5) | 10.0x Tarpit | 🟢 **ZERO** |
| **Multi-Turn Variable AST** | **100.0%** (5/5) | 10.0x Tarpit | 🟢 **ZERO** |
| **PII & Secret Exfiltration** | **100.0%** (5/5) | 1.0x | 🟢 **ZERO** |
| **Prompt Injection** | **100.0%** (5/5) | 10.0x Tarpit | 🟢 **ZERO** |
| **Schema Compliance** | **100.0%** (5/5) | 1.0x | 🟢 **ZERO** |
| **Ed25519 Crypto Probes** | **100.0%** (5/5) | 1.0x | 🔒 **MATHEMATICAL** |
| **Audit Proof Verification** | **100.0%** (5/5) | 1.0x | 🔒 **HMAC-SHA256** |

---

## 🚀 Quickstart

### 1. Run Interactive Security Dashboard
```bash
npm install
npm run dev
# Open http://localhost:3000/en/playground
```

### 2. Run Automated Red-Team Scanner
```bash
pip install pyyaml cryptography
python -m agentic_redteam.benchmark_runner --target http://localhost:3000/api/support
```

### 3. Deploy Production Enclave with Docker
```bash
docker compose -f docker-compose.production.yml up -d
```

---

## 📜 License
MIT License. Developed by SwishOS Core Security Team.
