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
};

const isProd = process.env.NODE_ENV === "production";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
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
const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || "0.0.0.0";

function resolveStaticFile(pathname) {
  if (pathname === "/") return null;
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const filePath = path.resolve(clientDir, "." + decoded);
  if (!filePath.startsWith(clientDir + path.sep)) return null;
  return filePath;
}

function getCacheControl(pathname) {
  return pathname.startsWith("/assets/")
    ? "public, max-age=31536000, immutable"
    : "public, max-age=3600";
}

if (typeof Bun !== "undefined") {
  console.log(`[Bun] Server running on http://${hostname}:${port}`);
  Bun.serve({
    port,
    hostname,
    async fetch(req) {
      const url = new URL(req.url);
      const filePath = resolveStaticFile(url.pathname);
      if (filePath) {
        const publicFile = Bun.file(filePath);
        if (await publicFile.exists()) {
          const ext = path.extname(filePath).toLowerCase();
          return new Response(publicFile, {
            headers: {
              ...SECURITY_HEADERS,
              "Content-Type": MIME_MAP[ext] || publicFile.type || "application/octet-stream",
              "Cache-Control": getCacheControl(url.pathname),
            },
          });
        }
      }
      const res = await s.fetch(req);
      const headers = new Headers(res.headers);
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(k)) headers.set(k, v);
      }
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
      const filePath = resolveStaticFile(url.pathname);
      if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_MAP[ext] || "application/octet-stream";
        res.writeHead(200, {
          ...SECURITY_HEADERS,
          "Content-Type": contentType,
          "Cache-Control": getCacheControl(url.pathname),
        });
        if (req.method === "HEAD") {
          res.end();
        } else {
          fs.createReadStream(filePath).pipe(res);
        }
        return;
      }

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }

      const webReq = new Request(url.href, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
        duplex: "half",
      });

      const webRes = await s.fetch(webReq);
      const outHeaders = {
        ...SECURITY_HEADERS,
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
