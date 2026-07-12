import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("MathKB database roles", () => {
  const sql = readFileSync(join(process.cwd(), "db/mathkb.roles.sql"), "utf8");

  it("allows writers to replace tag links without deleting notes", () => {
    expect(sql).toContain("GRANT DELETE ON note_tags TO mcp_writer");
    expect(sql).toContain("REVOKE DELETE ON notes, tags FROM mcp_writer");
    expect(sql).not.toMatch(/GRANT DELETE ON notes(?:,|\s)/);
  });

  it("does not recreate the retired web UI role", () => {
    expect(sql).not.toContain("mathkb_app");
  });
});
