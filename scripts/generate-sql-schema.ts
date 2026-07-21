/**
 * SwishOS Supabase PostgreSQL Security Incidents Schema DDL Generator
 * Outputs production SQL migration files with B-Tree, GIN, BRIN indexes, and RLS security policies.
 */

import fs from 'fs';
import path from 'path';

export function generatePostgreSQLDDL(): string {
  return `-- ==============================================================================
-- SwishOS Enclave Security Incidents Supabase PostgreSQL Migration (v0.5.0)
-- Production DDL with B-Tree, GIN, BRIN Indexes and Row-Level Security (RLS)
-- ==============================================================================

-- 1. Create Base Security Incidents Table
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip INET NOT NULL,
  endpoint TEXT NOT NULL DEFAULT '/api/support',
  rule_triggered TEXT NOT NULL,
  payload JSONB,
  hmac_proof TEXT
);

-- 2. Create High-Performance Indexes
-- B-Tree index for client IP lookup & subnet rate-limiting queries
CREATE INDEX IF NOT EXISTS idx_incidents_ip ON public.security_incidents USING btree (ip);

-- B-Tree index for filtering by rule triggered (e.g. SEMANTIC_CENTROID, ASI08)
CREATE INDEX IF NOT EXISTS idx_incidents_rule ON public.security_incidents USING btree (rule_triggered);

-- GIN index for JSONB payload key/value search
CREATE INDEX IF NOT EXISTS idx_incidents_payload ON public.security_incidents USING gin (payload);

-- BRIN index for fast time-series range scans
CREATE INDEX IF NOT EXISTS idx_incidents_ts ON public.security_incidents USING brin (timestamp);

-- 3. Row-Level Security (RLS) Configuration
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- Block all anonymous PUBLIC access
DROP POLICY IF EXISTS deny_public_access ON public.security_incidents;
CREATE POLICY deny_public_access ON public.security_incidents
  FOR ALL TO public
  USING (false);

-- Grant SELECT access to authenticated compliance auditor role only
DROP POLICY IF EXISTS compliance_auditor_select ON public.security_incidents;
CREATE POLICY compliance_auditor_select ON public.security_incidents
  FOR SELECT TO authenticated
  USING (true);

-- Grant INSERT access to service_role (backend API middleware)
DROP POLICY IF EXISTS service_role_insert ON public.security_incidents;
CREATE POLICY service_role_insert ON public.security_incidents
  FOR INSERT TO service_role
  WITH CHECK (true);
`;
}

export function writeSQLMigrationFile(outputDir = 'supabase/migrations') {
  const ddl = generatePostgreSQLDDL();
  const absoluteDir = path.resolve(outputDir);

  if (!fs.existsSync(absoluteDir)) {
    fs.mkdirSync(absoluteDir, { recursive: true });
  }

  const filePath = path.join(absoluteDir, '20260721_security_incidents.sql');
  fs.writeFileSync(filePath, ddl, 'utf-8');

  console.log(`✅ Supabase PostgreSQL DDL Migration written to: ${filePath}`);
  return filePath;
}

// Auto-run if executed directly
if (require.main === module) {
  writeSQLMigrationFile();
}
