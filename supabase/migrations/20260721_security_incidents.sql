-- Migration: Security Incidents Audit Log Table for Supabase / PostgreSQL
-- Task 1: Critical Gaps - Audit Logging Schema

CREATE TABLE IF NOT EXISTS security_incidents (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45) NOT NULL,
  endpoint VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  rule_triggered VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast IP and time range security audits
CREATE INDEX IF NOT EXISTS idx_security_incidents_ip ON security_incidents(ip);
CREATE INDEX IF NOT EXISTS idx_security_incidents_timestamp ON security_incidents(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_rule ON security_incidents(rule_triggered);
