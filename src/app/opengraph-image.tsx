import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS, OG_SIZE } from "@/lib/og";

export const alt = "koshikai — build · operate · research";
export const size = OG_SIZE;
export const contentType = "image/png";

const axes = [
  { keyword: "build", label: "Works" },
  { keyword: "operate", label: "Engineering" },
  { keyword: "research", label: "Research" },
];

export default async function Image() {
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
          koshikai.dev
        </span>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 26, color: OG_COLORS.muted }}>
            Software Engineer / Graduate Student
          </span>
          <h1
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 110,
              color: OG_COLORS.foreground,
              lineHeight: 1.1,
              margin: "16px 0 0 0",
            }}
          >
            koshikai
          </h1>
          <p style={{ fontSize: 34, color: OG_COLORS.foreground, margin: "28px 0 0 0", maxWidth: 980, lineHeight: 1.5 }}>
            Web・AI のプロダクトを作り、自宅のインフラで動かし、研究とデータで検証する。
          </p>
        </div>

        <div style={{ display: "flex", borderTop: `1px solid ${OG_COLORS.border}`, paddingTop: 28, gap: 56 }}>
          {axes.map((axis) => (
            <div key={axis.keyword} style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 22, color: OG_COLORS.accent }}>
                {axis.keyword}
              </span>
              <span style={{ fontSize: 26, color: OG_COLORS.foreground }}>{axis.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
