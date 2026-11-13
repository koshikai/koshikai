import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");

function readPublicJson(relPath: string) {
  const fullPath = path.join(publicDir, relPath);
  expect(fs.existsSync(fullPath)).toBe(true);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

describe("Agent Readiness discovery artifacts", () => {
  it("publishes sitemap.xml and references it alongside Agentmap from robots.txt", () => {
    const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain("<urlset");
    expect(sitemap).toContain("<loc>https://koshikai.dev</loc>");

    const robots = fs.readFileSync(path.join(publicDir, "robots.txt"), "utf8");
    expect(robots).toContain("Sitemap: https://koshikai.dev/sitemap.xml");
    expect(robots).toContain("Agentmap: https://koshikai.dev/.well-known/ai-catalog.json");
  });

  it("publishes RFC 9727 API catalog at /.well-known/api-catalog", () => {
    const catalog = readPublicJson(".well-known/api-catalog");
    expect(Array.isArray(catalog.linkset)).toBe(true);
    expect(catalog.linkset.length).toBeGreaterThan(0);
    for (const entry of catalog.linkset) {
      expect(typeof entry.anchor).toBe("string");
      expect(Array.isArray(entry["service-desc"])).toBe(true);
      expect(Array.isArray(entry["service-doc"])).toBe(true);
      expect(Array.isArray(entry.status)).toBe(true);
    }
  });

  it("publishes OAuth Protected Resource Metadata, OAuth AS metadata, and /auth.md", () => {
    const prm = readPublicJson(".well-known/oauth-protected-resource");
    const asMeta = readPublicJson(".well-known/oauth-authorization-server");
    const oidcMeta = readPublicJson(".well-known/openid-configuration");

    expect(prm.resource).toBe("https://koshikai.dev");
    expect(prm.authorization_servers).toContain(asMeta.issuer);
    expect(prm.bearer_methods_supported).toContain("header");

    expect(asMeta.issuer).toBe("https://koshikai.dev");
    expect(asMeta.authorization_endpoint).toBeTruthy();
    expect(asMeta.token_endpoint).toBeTruthy();
    expect(asMeta.jwks_uri).toBeTruthy();
    expect(Array.isArray(asMeta.grant_types_supported)).toBe(true);
    expect(Array.isArray(asMeta.response_types_supported)).toBe(true);

    expect(oidcMeta.issuer).toBe(asMeta.issuer);
    expect(asMeta.agent_auth).toBeDefined();
    expect(asMeta.agent_auth.skill).toBe("https://koshikai.dev/auth.md");
    expect(asMeta.agent_auth.register_uri).toBeTruthy();

    const authMd = fs.readFileSync(path.join(publicDir, "auth.md"), "utf8");
    expect(authMd).toMatch(/^#\s+.*auth\.md/im);
  });

  it("publishes MCP Server Card, A2A Agent Card, and Poppy manifest", () => {
    const card = readPublicJson(".well-known/mcp/server-card.json");
    expect(card.serverInfo?.name).toBeTruthy();
    expect(card.serverInfo?.version).toBeTruthy();
    expect(card.endpoint || card.url).toBeTruthy();
    expect(card.capabilities).toBeDefined();

    const a2a = readPublicJson(".well-known/agent-card.json");
    expect(a2a.name).toBeTruthy();
    expect(a2a.version).toBeTruthy();
    expect(Array.isArray(a2a.supportedInterfaces)).toBe(true);

    const poppy = readPublicJson(".well-known/poppy.json");
    expect(poppy.protocol_version).toBe("0.1");
    expect(poppy.organization?.domain).toBe("koshikai.dev");
  });

  it("publishes Agent Skills index with matching SHA-256 digests", () => {
    const index = readPublicJson(".well-known/agent-skills/index.json");
    expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json");
    expect(Array.isArray(index.skills)).toBe(true);
    expect(index.skills.length).toBeGreaterThan(0);

    for (const skill of index.skills) {
      expect(skill.name).toMatch(/^[a-z0-9-]+$/);
      expect(skill.type).toBe("skill-md");
      expect(skill.description).toBeTruthy();
      const skillRelPath = skill.url.replace(/^\//, "");
      const skillBytes = fs.readFileSync(path.join(publicDir, skillRelPath));
      const actualHash = crypto.createHash("sha256").update(skillBytes).digest("hex");
      expect(skill.digest).toBe(`sha256:${actualHash}`);
    }
  });

  it("publishes ARD capability manifest at /.well-known/ai-catalog.json", () => {
    const ard = readPublicJson(".well-known/ai-catalog.json");
    expect(ard.specVersion).toBe("1.0");
    expect(ard.host?.displayName).toBe("koshikai.dev");
    expect(ard.host?.identifier).toBe("did:web:koshikai.dev");
    expect(Array.isArray(ard.entries)).toBe(true);
    expect(ard.entries.length).toBeGreaterThan(0);

    for (const entry of ard.entries) {
      expect(entry.identifier).toMatch(/^urn:air:koshikai\.dev:/);
      expect(entry.displayName).toBeTruthy();
      expect(entry.type).toBeTruthy();
      const hasUrl = "url" in entry;
      const hasData = "data" in entry;
      expect(hasUrl !== hasData).toBe(true);
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("configures Link headers, Markdown negotiation, and WebMCP registration", () => {
    const serverCode = fs.readFileSync(path.join(rootDir, "server.mjs"), "utf8");
    expect(serverCode).toContain('rel="api-catalog"');
    expect(serverCode).toContain("text/markdown");
    expect(serverCode).toContain("x-markdown-tokens");
    expect(serverCode).toContain("application/linkset+json");

    const rootRouteCode = fs.readFileSync(path.join(rootDir, "src/routes/__root.tsx"), "utf8");
    expect(rootRouteCode).toContain("modelContext");
    expect(rootRouteCode).toContain("registerTool");
  });
});
