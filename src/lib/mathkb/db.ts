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
    // In production, prefer proper CA verification. Disabling
    // verification is only acceptable for self-signed certs on
    // an internal LAN and should be avoided on public networks.
    return { rejectUnauthorized: process.env.NODE_ENV === "production" } as const;
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
    const pool = new Pool({
      connectionString,
      max: Number(process.env.MATHKB_POOL_MAX ?? 10),
      ssl: getSslConfig(),
    });

    pool.on("error", (err) => {
      console.error("[mathkb-db] Unexpected PostgreSQL pool error:", err.message);
    });

    globalThis.mathKbPool = pool;
  }

  return globalThis.mathKbPool;
}

export function logPoolStats() {
  const pool = globalThis.mathKbPool;
  if (!pool) return;

  const stats = {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };

  console.error(
    JSON.stringify({
      level: "info",
      message: "[mathkb-db] Pool stats",
      timestamp: new Date().toISOString(),
      stats,
    }),
  );
}
