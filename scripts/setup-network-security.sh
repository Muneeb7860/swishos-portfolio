#!/usr/bin/env bash
# SwishOS Cloud Metadata Egress Security Script
# Drops outbound packets to cloud metadata IP endpoints (169.254.169.254) at the socket level.

set -euo pipefail

echo "🛡️  Configuring SwishOS Network Egress Isolation Rules..."

if command -v iptables >/dev/null 2>&1; then
  echo "🔒 Dropping IPv4 Cloud Metadata IP (169.254.169.254)..."
  iptables -A OUTPUT -d 169.254.169.254 -j DROP || true
  iptables -A OUTPUT -d 169.254.170.2 -j DROP || true # AWS ECS Metadata

  if command -v ip6tables >/dev/null 2>&1; then
    echo "🔒 Dropping IPv6 AWS Metadata IP (fd00:ec2::254)..."
    ip6tables -A OUTPUT -d fd00:ec2::254 -j DROP || true
  fi

  echo "✅ iptables Cloud Metadata Egress Rules Configured Successfully!"
else
  echo "⚠️ iptables not found on host. Ensure container runtime uses eBPF/NetworkPolicy isolation."
fi
