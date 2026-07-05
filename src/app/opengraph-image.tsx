import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteConfig } from "@/lib/site-config";

export const alt = "koshikai.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const site = getSiteConfig();
  const fontsDir = join(process.cwd(), "node_modules", "@fontsource");
  const [serifData, monoData] = await Promise.all([
    readFile(join(fontsDir, "zen-old-mincho", "files", "zen-old-mincho-latin-600-normal.woff")),
    readFile(join(fontsDir, "jetbrains-mono", "files", "jetbrains-mono-latin-400-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafaf7",
          padding: 80,
          fontFamily: '"Zen Old Mincho", serif',
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6b6b71",
          }}
        >
          koshikai.dev
        </span>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 72,
              height: 2,
              background: "#b23a32",
              marginBottom: 40,
            }}
          />
          <h1
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: "#17171a",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 900,
            }}
          >
            {site.headline}
          </h1>
        </div>

        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 22,
            letterSpacing: 2,
            color: "#6b6b71",
          }}
        >
          Hokkaido University · Graduate School of IS · M1
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zen Old Mincho", data: serifData, style: "normal", weight: 600 },
        { name: "JetBrains Mono", data: monoData, style: "normal", weight: 400 },
      ],
    }
  );
}
