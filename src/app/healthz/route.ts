import { NextResponse } from "next/server";
import { getnotesPool, hasnotesDatabaseConfig } from "@/lib/notes/db";
import { getSiteVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const variant = getSiteVariant();

  if (variant !== "notes") {
    return NextResponse.json({
      ok: true,
      variant,
      database: "not-required",
    });
  }

  if (!hasnotesDatabaseConfig()) {
    return NextResponse.json(
      {
        ok: false,
        variant,
        database: "missing-config",
      },
      { status: 503 },
    );
  }

  try {
    const pool = getnotesPool();
    await pool.query("SELECT 1");

    return NextResponse.json({
      ok: true,
      variant,
      database: "ok",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        variant,
        database: "unreachable",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
