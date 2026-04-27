import { NextResponse } from "next/server";
import { getMathKbPool, hasMathKbDatabaseConfig } from "@/lib/mathkb/db";
import { getSiteVariant } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const variant = getSiteVariant();

  if (variant !== "mathkb") {
    return NextResponse.json({
      ok: true,
      variant,
      database: "not-required",
    });
  }

  if (!hasMathKbDatabaseConfig()) {
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
    const pool = getMathKbPool();
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
