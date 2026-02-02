#!/bin/sh
set -e

echo "🔐 Waiting for Vault to be ready..."
until vault status > /dev/null 2>&1; do
  sleep 1
done

echo "🔐 Vault is ready. Initializing secrets..."

# Enable KV secrets engine v2
vault secrets enable -path=secret kv-v2 2>/dev/null || true

# Store database credentials
vault kv put secret/transcendence/database \
  username="transcendence" \
  password="transcendence123"

# Store JWT secret
vault kv put secret/transcendence/jwt \
  secret="bXlTZWNyZXRLZXlGb3JKV1RUb2tlbkdlbmVyYXRpb25UaGF0SXNBdExlYXN0MjU2Qml0c0xvbmcxMjM0NTY3ODk="

# Store application secrets
vault kv put secret/transcendence/app \
  api-key="your-api-key-here" \
  oauth-client-id="your-oauth-client-id" \
  oauth-client-secret="your-oauth-client-secret"

echo "✅ Vault secrets initialized successfully!"

# List all secrets
echo "📋 Current secrets:"
vault kv list secret/transcendence/ || true

exit 0
