#!/bin/sh
set -e

VAULT_PATH="secret/transcendence"
DB_USERNAME="transcendence"
DB_PASSWORD="transcendence123"
JWT_SECRET="bXlTZWNyZXRLZXlGb3JKV1RUb2tlbkdlbmVyYXRpb25UaGF0SXNBdExlYXN0MjU2Qml0c0xvbmcxMjM0NTY3ODk="
API_KEY="your-api-key-here"
OAUTH_CLIENT_ID="your-oauth-client-id"
OAUTH_CLIENT_SECRET="your-oauth-client-secret"

echo "Waiting for Vault to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0
until vault status >/dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
        echo "ERROR: Vault failed to start after $MAX_ATTEMPTS seconds"
        exit 1
    fi
    sleep 1
done
echo "Vault is ready"

echo "Enabling KV secrets engine v2..."
vault secrets enable -path=secret kv-v2 2>/dev/null || echo "Secrets engine already enabled"

echo "Storing database credentials..."
vault kv put "$VAULT_PATH/database" username="$DB_USERNAME" password="$DB_PASSWORD"

echo "Storing JWT secret..."
vault kv put "$VAULT_PATH/jwt" secret="$JWT_SECRET"

echo "Storing application secrets..."
vault kv put "$VAULT_PATH/app" api-key="$API_KEY" oauth-client-id="$OAUTH_CLIENT_ID" oauth-client-secret="$OAUTH_CLIENT_SECRET"

echo "Vault secrets initialized successfully!"
echo "Current secrets:"
vault kv list "$VAULT_PATH/" 2>/dev/null || echo "No secrets found or unable to list"

exit 0
