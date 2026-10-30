import path from "node:path";
import fs from "node:fs";
import s from "./dist/server/server.js";

const MIME_MAP = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || "0.0.0.0";

if (typeof Bun !== "undefined") {
  console.log(`[Bun] Server running on http://${hostname}:${port}`);
  Bun.serve({
    port,
    hostname,
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname !== "/") {
        const publicFile = Bun.file(`./dist/client${url.pathname}`);
        if (await publicFile.exists()) {
          return new Response(publicFile);
        }
      }
      return s.fetch(req);
    },
  });
} else {
  console.log(`[Node] Server running on http://${hostname}:${port}`);
  const { createServer } = await import("node:http");
  const { Readable } = await import("node:stream");

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      if (url.pathname !== "/") {
        const filePath = path.join(process.cwd(), "dist", "client", url.pathname);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_MAP[ext] || "application/octet-stream";
          res.writeHead(200, { "Content-Type": contentType });
          fs.createReadStream(filePath).pipe(res);
          return;
        }
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
      res.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));
      if (webRes.body) {
        Readable.fromWeb(webRes.body).pipe(res);
      } else {
        res.end();
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });

  server.listen(port, hostname);
}
