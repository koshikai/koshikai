import { ImageResponse } from "next/og";
import { AXES, getCaseBySlug } from "@/lib/cases";
import { loadOgFonts, OG_COLORS, OG_SIZE } from "@/lib/og";

export const alt = "Case Study | koshikai";
export const size = OG_SIZE;
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: OG_COLORS.background,
          padding: 80,
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 24, color: OG_COLORS.muted }}>
          koshikai.dev / {AXES[item.axis].label.toLowerCase()} — case study
        </span>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: 60,
              color: OG_COLORS.foreground,
              lineHeight: 1.3,
              margin: 0,
              maxWidth: 1040,
            }}
          >
            {item.title}
          </h1>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 18,
                color: OG_COLORS.foreground,
                border: `1px solid ${OG_COLORS.border}`,
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
    { ...size, fonts: await loadOgFonts() },
  );
}
