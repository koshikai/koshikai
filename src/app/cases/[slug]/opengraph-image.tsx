import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCaseBySlug } from "@/lib/cases";

export const alt = "Case Study | koshikai.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);

  if (!item) {
    return new Response("Not Found", { status: 404 });
  }

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
          koshikai.dev / case studies
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
              fontSize: 64,
              fontWeight: 600,
              color: "#17171a",
              lineHeight: 1.25,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {item.title}
          </h1>
          <p
            style={{
              fontSize: 22,
              color: "#6b6b71",
              lineHeight: 1.6,
              margin: "24px 0 0 0",
              maxWidth: 1000,
              overflow: "hidden",
            }}
          >
            {item.summary}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 16,
                letterSpacing: 2,
                color: "#b23a32",
                border: "1px solid #e4e3dc",
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
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
