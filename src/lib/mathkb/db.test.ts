import { afterEach, describe, expect, it } from "vitest";
import { hasMathKbDatabaseConfig } from "./db";

describe("MathKB database configuration", () => {
  const originalMathKbUrl = process.env.MATHKB_DATABASE_URL;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalMathKbUrl === undefined) delete process.env.MATHKB_DATABASE_URL;
    else process.env.MATHKB_DATABASE_URL = originalMathKbUrl;
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("rejects missing and blank connection strings", () => {
    delete process.env.MATHKB_DATABASE_URL;
    delete process.env.DATABASE_URL;
    expect(hasMathKbDatabaseConfig()).toBe(false);

    process.env.MATHKB_DATABASE_URL = "   ";
    expect(hasMathKbDatabaseConfig()).toBe(false);
  });

  it("accepts the fallback DATABASE_URL", () => {
    delete process.env.MATHKB_DATABASE_URL;
    process.env.DATABASE_URL = "postgresql://localhost/mathkb";
    expect(hasMathKbDatabaseConfig()).toBe(true);
  });
});
