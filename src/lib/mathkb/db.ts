import { Pool } from "pg";

declare global {
  var mathKbPool: Pool | undefined;
}

function getDatabaseUrl() {
  return process.env.MATHKB_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function getSslConfig() {
  const sslMode = process.env.MATHKB_DATABASE_SSL ?? "disable";

  if (sslMode === "require") {
    return { rejectUnauthorized: false } as const;
  }

  return undefined;
}

export function hasMathKbDatabaseConfig() {
  return getDatabaseUrl() !== null;
}

export function getMathKbPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error(
      "MATHKB_DATABASE_URL is not configured. Set it before starting the internal knowledge base or MCP server.",
    );
  }

  if (!globalThis.mathKbPool) {
    globalThis.mathKbPool = new Pool({
      connectionString,
      max: 10,
      ssl: getSslConfig(),
    });
  }

  return globalThis.mathKbPool;
}
