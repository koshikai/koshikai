// @vitest-environment node

import type { Server } from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  hasConfig: vi.fn(() => true),
  query: vi.fn(async () => ({ rows: [] })),
  searchNotes: vi.fn(async () => ({ notes: [], totalFilteredNotes: 0 })),
  getNoteBySlug: vi.fn(async () => null),
  listFields: vi.fn(async () => []),
  listTags: vi.fn(async () => []),
  createNote: vi.fn(async () => ({ success: true, slug: "new-note" })),
  updateNote: vi.fn(async () => ({ success: true })),
  semanticSearchNotes: vi.fn(async () => []),
}));

vi.mock("../lib/mathkb/db", () => ({
  hasMathKbDatabaseConfig: mocks.hasConfig,
  getMathKbPool: () => ({ query: mocks.query }),
  logPoolStats: vi.fn(),
}));

vi.mock("../lib/mathkb/repository", () => ({
  searchNotes: mocks.searchNotes,
  getNoteBySlug: mocks.getNoteBySlug,
  listFields: mocks.listFields,
  listTags: mocks.listTags,
  createNote: mocks.createNote,
  updateNote: mocks.updateNote,
  semanticSearchNotes: mocks.semanticSearchNotes,
}));

import {
  checkRateLimit,
  createMathKbHttpApp,
  createMathKbServer,
  getRateLimitEntryCount,
  resetRateLimitState,
  validateMcpConfig,
} from "./server";

async function listen() {
  const app = createMathKbHttpApp();
  const server = await new Promise<Server>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected TCP address");
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

describe("MathKB MCP server", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalBindHost = process.env.MCP_BIND_HOST;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.hasConfig.mockReturnValue(true);
    resetRateLimitState();
    process.env.NODE_ENV = "test";
    process.env.MCP_BIND_HOST = "127.0.0.1";
    delete process.env.MCP_ALLOWED_HOSTS;
  });

  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalBindHost === undefined) delete process.env.MCP_BIND_HOST;
    else process.env.MCP_BIND_HOST = originalBindHost;
  });

  it("publishes seven tools without a destructive delete tool", async () => {
    const server = createMathKbServer();
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual([
      "create_note",
      "get_note",
      "list_fields",
      "list_tags",
      "search_notes",
      "semantic_search_notes",
      "update_note",
    ]);

    const calls = [
      ["search_notes", {}],
      ["get_note", { slug: "missing" }],
      ["list_fields", {}],
      ["list_tags", {}],
      ["create_note", { title: "New", field: "Algebra", bodyMarkdown: "# New" }],
      ["update_note", { slug: "new-note", title: "Updated" }],
      ["semantic_search_notes", { query: "algebra" }],
    ] as const;
    for (const [name, args] of calls) {
      const result = await client.callTool({ name, arguments: args });
      expect(result).toHaveProperty("structuredContent");
      expect(result.isError).not.toBe(true);
    }

    await client.close();
    await server.close();
  });

  it("validates database and production host configuration", () => {
    expect(() => validateMcpConfig("invalid")).toThrow("Unsupported MCP transport");

    mocks.hasConfig.mockReturnValue(false);
    expect(() => validateMcpConfig("stdio")).toThrow("must be configured");

    mocks.hasConfig.mockReturnValue(true);
    process.env.NODE_ENV = "production";
    expect(() => validateMcpConfig("http")).toThrow("MCP_ALLOWED_HOSTS");
    process.env.MCP_ALLOWED_HOSTS = "mathkb.local";
    expect(() => validateMcpConfig("http")).not.toThrow();
  });

  it("cleans expired rate-limit entries and rejects the 61st request", () => {
    for (let index = 0; index < 60; index++) expect(checkRateLimit("10.0.0.1", 0)).toBe(true);
    expect(checkRateLimit("10.0.0.1", 0)).toBe(false);
    expect(getRateLimitEntryCount()).toBe(1);
    expect(checkRateLimit("10.0.0.2", 60_000)).toBe(true);
    expect(getRateLimitEntryCount()).toBe(1);
  });

  it("serves health checks and rejects unsupported MCP methods", async () => {
    const { server, baseUrl } = await listen();
    try {
      expect((await fetch(`${baseUrl}/healthz`)).status).toBe(200);
      expect((await fetch(`${baseUrl}/mcp`)).status).toBe(405);
      expect((await fetch(`${baseUrl}/mcp`, { method: "DELETE" })).status).toBe(405);
      const initialize = await fetch(`${baseUrl}/mcp`, {
        method: "POST",
        headers: {
          accept: "application/json, text/event-stream",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-03-26",
            capabilities: {},
            clientInfo: { name: "http-test", version: "1.0.0" },
          },
        }),
      });
      expect(initialize.status).toBe(200);
      expect(mocks.query).toHaveBeenCalledWith("SELECT 1");
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("returns 429 after the per-IP HTTP limit is exhausted", async () => {
    const { server, baseUrl } = await listen();
    try {
      for (let index = 0; index < 60; index++) {
        expect((await fetch(`${baseUrl}/healthz`)).status).toBe(200);
      }
      expect((await fetch(`${baseUrl}/healthz`)).status).toBe(429);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });

  it("returns 503 when the database health query fails", async () => {
    mocks.query.mockRejectedValueOnce(new Error("database unavailable"));
    const { server, baseUrl } = await listen();
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      expect(response.status).toBe(503);
      expect(await response.json()).toMatchObject({ ok: false, error: "database unavailable" });
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
