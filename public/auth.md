# koshikai.dev auth.md

You are an AI agent interacting with **koshikai.dev** (`https://koshikai.dev`). Public portfolio pages, Markdown representations (`Accept: text/markdown`), and read-only MCP tools (`POST /mcp`) can be accessed directly. For authenticated agent operations, this service publishes **agentic registration** and OAuth 2.0 / OIDC discovery metadata: discover → register → (claim if needed) → exchange for an `access_token` → call protected APIs → handle revocation.

## Step 1 — Discover

### 1a. Fetch OAuth Protected Resource Metadata (RFC 9728)

```http
GET https://koshikai.dev/.well-known/oauth-protected-resource
```

Response:

```json
{
  "resource": "https://koshikai.dev",
  "resource_name": "koshikai.dev",
  "resource_logo_uri": "https://koshikai.dev/icon.png",
  "authorization_servers": [
    "https://koshikai.dev"
  ],
  "scopes_supported": [
    "openid",
    "profile",
    "portfolio:read",
    "mcp:tools"
  ],
  "bearer_methods_supported": [
    "header"
  ]
}
```

### 1b. Fetch Authorization Server Metadata (RFC 8414)

```http
GET https://koshikai.dev/.well-known/oauth-authorization-server
```

The authorization server metadata includes the `agent_auth` block pointing to:
- `skill`: `https://koshikai.dev/auth.md`
- `register_uri` / `identity_endpoint`: `https://koshikai.dev/api/auth/agent/identity`
- `claim_uri` / `claim_endpoint`: `https://koshikai.dev/api/auth/agent/claim`
- `revocation_uri`: `https://koshikai.dev/api/auth/revoke`
- `token_endpoint`: `https://koshikai.dev/api/auth/token`

## Step 2 — Choose Registration Method

koshikai.dev supports the following `identity_types_supported`:

1. **`identity_assertion` (ID-JAG / Verified Email)**:
   - Supported assertion types: `urn:ietf:params:oauth:token-type:id-jag`, `verified_email`
   - Supported credential types: `bearer_token`, `jwt_bearer`
2. **`anonymous`**:
   - Supported credential types: `bearer_token`
   - Claim URL: `https://koshikai.dev/api/auth/agent/claim`

## Step 3 — Register Agent Identity

Send a `POST` request to `https://koshikai.dev/api/auth/agent/identity`:

```http
POST /api/auth/agent/identity HTTP/1.1
Host: koshikai.dev
Content-Type: application/json

{
  "type": "identity_assertion",
  "assertion_type": "urn:ietf:params:oauth:token-type:id-jag",
  "assertion": "<ID-JAG-JWT>"
}
```

Or for anonymous registration with a claim URL:

```http
POST /api/auth/agent/identity HTTP/1.1
Host: koshikai.dev
Content-Type: application/json

{
  "type": "anonymous"
}
```

## Step 4 — Exchange for Access Token

Exchange the issued `identity_assertion` at `POST /api/auth/token` using `urn:ietf:params:oauth:grant-type:jwt-bearer`:

```http
POST /api/auth/token HTTP/1.1
Host: koshikai.dev
Content-Type: application/x-www-form-urlencoded

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=<IDENTITY_ASSERTION>
```

## Step 5 — Call MCP / API Endpoints

Pass the issued token in the `Authorization` header when calling `/mcp`:

```http
POST /mcp HTTP/1.1
Host: koshikai.dev
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

## Step 6 — Revocation

Revoke tokens at `POST https://koshikai.dev/api/auth/revoke` (RFC 7009) or deliver Security Event Tokens (`https://schemas.workos.com/events/agent/auth/identity/assertion/revoked`) to `https://koshikai.dev/api/auth/agent/events`.
