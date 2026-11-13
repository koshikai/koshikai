---
name: koshikai-auth
description: Discover OAuth 2.0 / OIDC metadata and register AI agent identities with koshikai.dev via Auth.md.
---

# koshikai.dev Agent Authentication Skill

Use this skill to discover OAuth 2.0 Protected Resource Metadata (RFC 9728), Authorization Server Metadata (RFC 8414), and register an AI agent identity with **koshikai.dev** (`https://koshikai.dev`).

## Discovery Endpoints

1. **Agent Auth Instructions**: `GET https://koshikai.dev/auth.md`
2. **OAuth Protected Resource Metadata**: `GET https://koshikai.dev/.well-known/oauth-protected-resource`
3. **OAuth Authorization Server Metadata**: `GET https://koshikai.dev/.well-known/oauth-authorization-server`
4. **OpenID Connect Configuration**: `GET https://koshikai.dev/.well-known/openid-configuration`
5. **JSON Web Key Set (JWKS)**: `GET https://koshikai.dev/.well-known/jwks.json`

## Registration & Token Flow

1. Inspect `agent_auth` in `/.well-known/oauth-authorization-server`.
2. Register your agent identity at `POST https://koshikai.dev/api/auth/agent/identity` using `identity_assertion` (`urn:ietf:params:oauth:token-type:id-jag` or `verified_email`) or `anonymous`.
3. Exchange the assertion for an access token at `POST https://koshikai.dev/api/auth/token`.
4. Present `Authorization: Bearer <ACCESS_TOKEN>` on authenticated requests.
