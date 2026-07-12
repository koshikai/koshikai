import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  it("references the existing PNG application icon", () => {
    const icon = manifest().icons?.[0];

    expect(icon).toMatchObject({ src: "/icon.png", sizes: "512x512", type: "image/png" });
    expect(existsSync(join(process.cwd(), "src/app/icon.png"))).toBe(true);
  });
});
