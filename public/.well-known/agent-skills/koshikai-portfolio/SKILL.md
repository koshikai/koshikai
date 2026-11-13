---
name: koshikai-portfolio
description: Retrieve portfolio works, engineering capabilities, and research topics from koshikai.dev via Markdown negotiation or MCP.
---

# koshikai.dev Portfolio Skill

Use this skill to inspect **koshikai.dev** (`https://koshikai.dev`) works, engineering stack, homelab operations, and research topics.

## 1. Markdown Content Negotiation

Request any public page with `Accept: text/markdown` to receive a concise Markdown representation with `Content-Type: text/markdown; charset=utf-8` and `x-markdown-tokens`:

```http
GET https://koshikai.dev/ HTTP/1.1
Accept: text/markdown
```

Supported routes:
- `/` — Overview of Build, Operate, and Research
- `/works` — Individual software projects (`Smoke it.`, `KariGallery`, `ひだまりマップ`, `Turbo Circuit`)
- `/engineering` — Technical stack, Proxmox homelab architecture, CI/CD deployment pipeline
- `/research` — Reinforcement learning for Boolean network control, winter rail switch risk analysis, and publications
- `/about` — Profile, education, and contact links
- `/cases` — List of 11 technical case studies

## 2. LLM Documentation Files

- `GET https://koshikai.dev/llms.txt` — Structured overview and links
- `GET https://koshikai.dev/llms-full.txt` — Complete portfolio reference in a single Markdown document

## 3. MCP Streamable HTTP Endpoint

Query `POST https://koshikai.dev/mcp` using JSON-RPC 2.0:
- `get_portfolio_overview`
- `list_works`
- `list_research_topics`
- `list_case_studies`
