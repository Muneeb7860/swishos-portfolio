# Workspace Security & Engineering Rules

## Zero-Trust Enclave & Infrastructure Guards

1. **IP Encoding Normalization Before SSRF Filtering**:
   - Always normalize hostnames using `normalizeHostToIP()` before checking against cloud metadata (`169.254.169.254`, `fd00:ec2::254`), loopback (`127.0.0.0/8`, `localhost`, `0.0.0.0`, `::1`), or private CIDRs.
   - Support Hex (`0x...`), Octal (`0251...`), Dword Integer, bracketed IPv6, and IPv4-mapped IPv6 (`::ffff:`).

2. **Luhn-Validated Credit Card Redaction**:
   - Credit card PII redactions MUST validate Luhn algorithm checksums (`isValidLuhn()`) to avoid corrupting 13-digit Unix millisecond timestamps (`Date.now()`).

3. **Dynamic Refusal Timing Floors**:
   - Timing jitter padding MUST use dynamic floors (`Math.max(120, elapsed + 15 + jitter)`) to obscure pipeline execution depth on late-stage guardrail blocks.

4. **Complete Audit Proof CORS Exposure**:
   - All audit proof response headers (`X-SwishOS-Audit-Proof`, `X-SwishOS-Audit-Timestamp`, `X-SwishOS-Audit-Nonce`) MUST be explicitly included in `Access-Control-Expose-Headers`.
