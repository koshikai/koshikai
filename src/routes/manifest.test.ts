import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("manifest", () => {
  it("references the existing PNG application icon", () => {
    const manifestPath = join(process.cwd(), "public/manifest.json");
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const icon = manifest.icons?.[0];

    expect(icon).toMatchObject({ src: "/icon.png", sizes: "512x512", type: "image/png" });
    expect(existsSync(join(process.cwd(), "public/icon.png"))).toBe(true);
  });
});
