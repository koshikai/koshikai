import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "koshikai.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontPath = join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "m-plus-rounded-1c",
    "files",
    "m-plus-rounded-1c-latin-700-normal.woff"
  );
  const fontData = await readFile(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 55%, #f8fafc 100%)",
          padding: 64,
          fontFamily: '"M PLUS Rounded 1c", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 48,
            background: "linear-gradient(to top right, #38bdf8, #3b82f6)",
            marginBottom: 32,
            boxShadow: "0 10px 30px rgba(56, 189, 248, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "white",
            }}
          >
            K
          </span>
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#18181b",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          koshikai.dev
        </h1>
        <p
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#52525b",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Solving everyday problems with systems
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "M PLUS Rounded 1c",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
