import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "./route";

const mockQuery = vi.fn();

vi.mock("@/lib/mathkb/db", () => ({
  getMathKbPool: vi.fn(() => ({ query: mockQuery })),
  hasMathKbDatabaseConfig: vi.fn(),
}));

vi.mock("@/lib/site-config", () => ({
  getSiteVariant: vi.fn(),
}));

import { getSiteVariant } from "@/lib/site-config";
import { hasMathKbDatabaseConfig } from "@/lib/mathkb/db";

describe("GET /healthz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockReset();
    (hasMathKbDatabaseConfig as ReturnType<typeof vi.fn>).mockReturnValue(true);
  });

  it("returns ok for portfolio variant", async () => {
    (getSiteVariant as ReturnType<typeof vi.fn>).mockReturnValue("portfolio");

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      variant: "portfolio",
      database: "not-required",
    });
  });

  it("returns 503 when database config is missing", async () => {
    (getSiteVariant as ReturnType<typeof vi.fn>).mockReturnValue("mathkb");
    (hasMathKbDatabaseConfig as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.ok).toBe(false);
    expect(data.database).toBe("missing-config");
  });

  it("returns ok when database is reachable", async () => {
    (getSiteVariant as ReturnType<typeof vi.fn>).mockReturnValue("mathkb");
    mockQuery.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.database).toBe("ok");
  });

  it("returns 503 when database is unreachable", async () => {
    (getSiteVariant as ReturnType<typeof vi.fn>).mockReturnValue("mathkb");
    mockQuery.mockRejectedValueOnce(new Error("Connection refused"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.ok).toBe(false);
    expect(data.database).toBe("unreachable");
    expect(data.error).toBe("Connection refused");
  });
});
