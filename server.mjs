import path from "node:path";
import fs from "node:fs";
import s from "./dist/server/server.js";

const MIME_MAP = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const WELL_KNOWN_MIME_MAP = {
  "/.well-known/api-catalog": "application/linkset+json; charset=utf-8",
  "/.well-known/oauth-authorization-server": "application/json; charset=utf-8",
  "/.well-known/openid-configuration": "application/json; charset=utf-8",
  "/.well-known/oauth-protected-resource": "application/json; charset=utf-8",
};

const AGENT_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
  '</llms.txt>; rel="service-doc"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"',
].join(", ");

const isProd = process.env.NODE_ENV === "production";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  Link: AGENT_LINK_HEADER,
  ...(isProd
    ? {
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "Content-Security-Policy":
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data:; " +
          "font-src 'self'; " +
          "connect-src 'self'; " +
          "frame-ancestors 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self';",
      }
    : {}),
};

const clientDir = path.resolve(process.cwd(), "dist", "client");
const publicDir = path.resolve(process.cwd(), "public");
const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || "0.0.0.0";

function isCorsDiscoveryPath(pathname) {
  return (
    pathname.startsWith("/.well-known/") ||
    pathname === "/auth.md" ||
    pathname === "/llms.txt" ||
    pathname === "/llms-full.txt" ||
    pathname === "/openapi.json" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/mcp"
  );
}

function resolveStaticFile(pathname) {
  if (pathname === "/") return null;
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  for (const baseDir of [clientDir, publicDir]) {
    const candidate = path.resolve(baseDir, "." + decoded);
    if (!candidate.startsWith(baseDir + path.sep)) continue;
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        const ext = path.extname(candidate).toLowerCase();
        const contentType =
          WELL_KNOWN_MIME_MAP[decoded] || MIME_MAP[ext] || "application/octet-stream";
        return {
          path: candidate,
          contentType,
          cors: isCorsDiscoveryPath(decoded),
        };
      }
    } catch {}
  }

  return null;
}

function getCacheControl(pathname) {
  return pathname.startsWith("/assets/")
    ? "public, max-age=31536000, immutable"
    : "public, max-age=3600";
}

function wantsMarkdown(acceptHeader) {
  if (!acceptHeader || typeof acceptHeader !== "string") return false;
  const lower = acceptHeader.toLowerCase();
  if (!lower.includes("text/markdown")) return false;
  const parts = lower.split(",").map((p) => p.trim());
  let mdQ = 0;
  let htmlQ = 0;
  for (const part of parts) {
    const [media, ...params] = part.split(";").map((s) => s.trim());
    let q = 1;
    for (const param of params) {
      if (param.startsWith("q=")) {
        const parsed = Number.parseFloat(param.slice(2));
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }
    if (media === "text/markdown") mdQ = Math.max(mdQ, q);
    if (media === "text/html" || media === "application/xhtml+xml") htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > 0 && mdQ >= htmlQ;
}

function readPublicTextFile(filename, fallback) {
  for (const dir of [clientDir, publicDir]) {
    const filePath = path.join(dir, filename);
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf8");
      }
    } catch {}
  }
  return fallback;
}

const MARKDOWN_PAGES = {
  "/": () =>
    readPublicTextFile(
      "llms.txt",
      "# koshikai.dev\n\nWeb アプリを企画から作り、自宅のサーバーで動かしています。研究は強化学習によるネットワーク制御です。\n",
    ),
  "/works": () =>
    [
      "# Works | koshikai.dev",
      "",
      "企画・設計・実装・デプロイまで単独で手がけた個人開発作品の一覧です。",
      "",
      "- **Smoke it.** (`https://smoke-it.koshikai.dev`): 喫煙習慣を記録し、改善を支援する AI コーチ付き PWA (TanStack Start, PWA, PostgreSQL / Prisma, OpenRouter)",
      "- **KariGallery** (`https://gallery.koshikai.dev`): イラスト作品の展示・管理ギャラリー (TanStack Start, Auth.js, Stripe, Prisma)",
      "- **ひだまりマップ**: 部屋の窓に日が当たる時間帯を 3D 都市モデル上で確かめる Web アプリ (Next.js, CesiumJS, PLATEAU 3D Tiles, SunCalc)",
      "- **Turbo Circuit** (`https://github.com/koshikai/TurboCircuit`): ドリフトとアイテムで競う 3D カートレーシングゲーム (Unity, C#, URP, Unity Relay)",
      "",
    ].join("\n"),
  "/engineering": () =>
    [
      "# Engineering | koshikai.dev",
      "",
      "開発を支える技術スタックと、自宅 Proxmox サーバーでの運用実績です。",
      "",
      "- **Frontend**: TypeScript, React, TanStack Start, Next.js, PWA",
      "- **Backend**: Node.js, Python, FastAPI, Auth.js",
      "- **Database**: PostgreSQL, Prisma, pgvector",
      "- **Infrastructure**: Linux, Docker, Proxmox, Nginx, self-hosting",
      "- **CI/CD**: Git, GitHub Actions, GHCR, self-hosted runner",
      "- **AI**: LLM, AI エージェント, MCP",
      "",
    ].join("\n"),
  "/research": () =>
    [
      "# Research | koshikai.dev",
      "",
      "強化学習によるブーリアンネットワーク制御とデータ分析の研究テーマ・学会発表です。",
      "",
      "1. **強化学習 × 遺伝子ネットワーク制御**（卒業研究）: 信号時相論理 (STL) で時間制約を記述し、表形式 Q 学習でエッジ除去制御を学習。Wnt5a (128/128) と皮質形成モデル (32/32) で目標集合への到達と維持を確認。",
      "2. **データ分析 × 鉄道の冬期リスク**（大学院 PBL）: JR 北海道の冬期ポイント不転換リスクをロジスティック回帰で定量化（Lift 19.9×）。",
      "3. **時間制約 × 到達可能性**: 状態空間の全列挙による入力仕様下の到達可能初期状態と最小除去回数の集計。",
      "4. **強化学習 × モデル間の知識転移**（修士研究）: 粗視化モデルから詳細モデルへの制御知識転移と GNN 蒸留の評価。",
      "",
    ].join("\n"),
  "/about": () =>
    [
      "# About | koshikai.dev",
      "",
      "- **Name**: koshikai",
      "- **Role**: Software Engineer / Graduate Student",
      "- **Education**: 北海道大学 大学院情報科学院 修士課程 1年",
      "- **GitHub**: https://github.com/koshikai",
      "- **X**: https://x.com/siywyk",
      "- **Email**: contact@koshikai.dev",
      "",
    ].join("\n"),
  "/cases": () =>
    readPublicTextFile(
      "llms-full.txt",
      "# Cases | koshikai.dev\n\n開発・運用・研究のケーススタディ一覧は https://koshikai.dev/cases を参照してください。\n",
    ),
};

function getMarkdownRepresentation(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const generator =
    MARKDOWN_PAGES[normalized] ||
    (normalized.startsWith("/cases/") ? MARKDOWN_PAGES["/cases"] : null);
  if (!generator) return null;
  const body = generator();
  const tokens = String(Math.max(1, Math.ceil(body.length / 4)));
  return { body, tokens };
}

function ensureAcceptAllowsHtml(acceptHeader) {
  if (!acceptHeader || typeof acceptHeader !== "string") return "text/html, */*;q=0.8";
  if (acceptHeader.includes("*/*") || acceptHeader.includes("text/html")) return acceptHeader;
  return `${acceptHeader}, text/html;q=0.5, */*;q=0.1`;
}

function buildMcpResponse(rpcBody) {
  const id = rpcBody && typeof rpcBody === "object" && "id" in rpcBody ? rpcBody.id : null;
  const method = rpcBody && typeof rpcBody === "object" ? rpcBody.method : undefined;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-03-26",
        serverInfo: {
          name: "koshikai.dev MCP Server",
          version: "1.0.0",
        },
        capabilities: {
          tools: {},
          resources: {},
        },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "get_portfolio_overview",
            description: "koshikai.dev のプロフィール、主要作品、技術領域、研究テーマの概要を取得します。",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "list_works",
            description:
              "個人開発作品 (Smoke it., KariGallery, ひだまりマップ, Turbo Circuit) の一覧と技術スタックを取得します。",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "list_research_topics",
            description:
              "研究トピック（強化学習によるブーリアンネットワーク制御、冬期鉄道リスク分析、知識転移）と学会発表一覧を取得します。",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "list_case_studies",
            description:
              "開発 (build)・運用 (operate)・研究 (research) のケーススタディ一覧を取得します。",
            inputSchema: {
              type: "object",
              properties: {
                axis: {
                  type: "string",
                  enum: ["build", "operate", "research"],
                  description: "絞り込む軸（省略時は全件）",
                },
              },
            },
          },
        ],
      },
    };
  }

  if (method === "resources/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        resources: [
          {
            uri: "https://koshikai.dev/llms.txt",
            name: "koshikai.dev Overview (llms.txt)",
            mimeType: "text/markdown",
          },
          {
            uri: "https://koshikai.dev/llms-full.txt",
            name: "koshikai.dev Full Guide (llms-full.txt)",
            mimeType: "text/markdown",
          },
          {
            uri: "https://koshikai.dev/openapi.json",
            name: "koshikai.dev OpenAPI 3.1 Specification",
            mimeType: "application/json",
          },
        ],
      },
    };
  }

  if (method === "tools/call") {
    const toolName = rpcBody?.params?.name;
    const textByTool = {
      get_portfolio_overview: MARKDOWN_PAGES["/"],
      list_works: MARKDOWN_PAGES["/works"],
      list_research_topics: MARKDOWN_PAGES["/research"],
      list_case_studies: MARKDOWN_PAGES["/cases"],
    };
    const generator = textByTool[toolName];
    if (generator) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: generator(),
            },
          ],
        },
      };
    }
    return {
      jsonrpc: "2.0",
      id,
      result: {
        isError: true,
        content: [
          {
            type: "text",
            text: "Unknown tool name. Call tools/list to inspect available tools.",
          },
        ],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    result: { ok: true },
  };
}

if (typeof Bun !== "undefined") {
  console.log(`[Bun] Server running on http://${hostname}:${port}`);
  Bun.serve({
    port,
    hostname,
    async fetch(req) {
      const url = new URL(req.url);

      // Health check endpoint
      if (url.pathname === "/healthz") {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            ...SECURITY_HEADERS,
            "Content-Type": "application/json",
          },
        });
      }

      // MCP endpoint
      if (url.pathname === "/mcp") {
        const mcpHeaders = {
          ...SECURITY_HEADERS,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        };
        if (req.method === "OPTIONS") {
          return new Response(null, { status: 204, headers: mcpHeaders });
        }
        if (req.method === "POST") {
          let rpcBody = null;
          try {
            rpcBody = await req.json();
          } catch {}
          return new Response(JSON.stringify(buildMcpResponse(rpcBody)), {
            status: 200,
            headers: { ...mcpHeaders, "Content-Type": "application/json; charset=utf-8" },
          });
        }
        const cardMatch = resolveStaticFile("/.well-known/mcp/server-card.json");
        if (cardMatch) {
          return new Response(Bun.file(cardMatch.path), {
            status: 200,
            headers: { ...mcpHeaders, "Content-Type": "application/json; charset=utf-8" },
          });
        }
      }

      // Markdown content negotiation for agents (Accept: text/markdown)
      if (
        (req.method === "GET" || req.method === "HEAD") &&
        wantsMarkdown(req.headers.get("accept"))
      ) {
        const md = getMarkdownRepresentation(url.pathname);
        if (md) {
          return new Response(req.method === "HEAD" ? null : md.body, {
            status: 200,
            headers: {
              ...SECURITY_HEADERS,
              "Content-Type": "text/markdown; charset=utf-8",
              Vary: "Accept",
              "x-markdown-tokens": md.tokens,
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      }

      const staticMatch = resolveStaticFile(url.pathname);
      if (staticMatch) {
        const publicFile = Bun.file(staticMatch.path);
        const headers = new Headers(SECURITY_HEADERS);
        headers.set("Content-Type", staticMatch.contentType);
        headers.set("Cache-Control", getCacheControl(url.pathname));
        if (staticMatch.cors) {
          headers.set("Access-Control-Allow-Origin", "*");
        }
        return new Response(req.method === "HEAD" ? null : publicFile, {
          status: 200,
          headers,
        });
      }

      // Unknown /.well-known/* paths should return 404 directly (avoid SSR 406 on JSON Accept headers)
      if (url.pathname.startsWith("/.well-known/")) {
        return new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: {
            ...SECURITY_HEADERS,
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const reqHeaders = new Headers(req.headers);
      reqHeaders.set("accept", ensureAcceptAllowsHtml(reqHeaders.get("accept")));
      const ssrReq = new Request(req.url, {
        method: req.method,
        headers: reqHeaders,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
        duplex: "half",
      });

      const res = await s.fetch(ssrReq);
      const headers = new Headers(res.headers);
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(k)) headers.set(k, v);
      }
      headers.set("Vary", "Accept");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    },
  });
} else {
  console.log(`[Node] Server running on http://${hostname}:${port}`);
  const { createServer } = await import("node:http");
  const { Readable } = await import("node:stream");

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

      // Health check endpoint
      if (url.pathname === "/healthz") {
        res.writeHead(200, {
          ...SECURITY_HEADERS,
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      // MCP endpoint
      if (url.pathname === "/mcp") {
        const mcpHeaders = {
          ...SECURITY_HEADERS,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        };
        if (req.method === "OPTIONS") {
          res.writeHead(204, mcpHeaders);
          res.end();
          return;
        }
        if (req.method === "POST") {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
          }
          let rpcBody = null;
          try {
            rpcBody = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          } catch {}
          res.writeHead(200, {
            ...mcpHeaders,
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify(buildMcpResponse(rpcBody)));
          return;
        }
        const cardMatch = resolveStaticFile("/.well-known/mcp/server-card.json");
        if (cardMatch) {
          res.writeHead(200, {
            ...mcpHeaders,
            "Content-Type": "application/json; charset=utf-8",
          });
          fs.createReadStream(cardMatch.path).pipe(res);
          return;
        }
      }

      // Markdown content negotiation for agents (Accept: text/markdown)
      const acceptHeader = Array.isArray(req.headers.accept)
        ? req.headers.accept.join(", ")
        : req.headers.accept;
      if ((req.method === "GET" || req.method === "HEAD") && wantsMarkdown(acceptHeader)) {
        const md = getMarkdownRepresentation(url.pathname);
        if (md) {
          res.writeHead(200, {
            ...SECURITY_HEADERS,
            "Content-Type": "text/markdown; charset=utf-8",
            Vary: "Accept",
            "x-markdown-tokens": md.tokens,
            "Access-Control-Allow-Origin": "*",
          });
          if (req.method === "HEAD") {
            res.end();
          } else {
            res.end(md.body);
          }
          return;
        }
      }

      const staticMatch = resolveStaticFile(url.pathname);
      if (staticMatch) {
        res.writeHead(200, {
          ...SECURITY_HEADERS,
          "Content-Type": staticMatch.contentType,
          "Cache-Control": getCacheControl(url.pathname),
          ...(staticMatch.cors ? { "Access-Control-Allow-Origin": "*" } : {}),
        });
        if (req.method === "HEAD") {
          res.end();
        } else {
          fs.createReadStream(staticMatch.path).pipe(res);
        }
        return;
      }

      // Unknown /.well-known/* paths should return 404 directly (avoid SSR 406 on JSON Accept headers)
      if (url.pathname.startsWith("/.well-known/")) {
        res.writeHead(404, {
          ...SECURITY_HEADERS,
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
      }

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
      headers.set("accept", ensureAcceptAllowsHtml(headers.get("accept")));

      const webReq = new Request(url.href, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
        duplex: "half",
      });

      const webRes = await s.fetch(webReq);
      const outHeaders = {
        ...SECURITY_HEADERS,
        Vary: "Accept",
        ...Object.fromEntries(webRes.headers.entries()),
      };
      res.writeHead(webRes.status, outHeaders);
      if (webRes.body && req.method !== "HEAD") {
        Readable.fromWeb(webRes.body).pipe(res);
      } else {
        res.end();
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500, SECURITY_HEADERS);
      res.end("Internal Server Error");
    }
  });

  server.listen(port, hostname);
}
