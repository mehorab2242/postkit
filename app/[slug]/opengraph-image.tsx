import { ImageResponse } from "next/og";

import { getTool, tools } from "@/lib/tools";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Postkit";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF9",
          color: "#16161A",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        {/* Corner registration marks, the same frame the tools sit inside. */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderTop: "6px solid #FF0080",
              borderLeft: "6px solid #FF0080",
            }}
          />
          <div style={{ fontSize: 30, color: "#6E6E76" }}>postkit.com</div>
          <div
            style={{
              width: 40,
              height: 40,
              borderTop: "6px solid #FF0080",
              borderRight: "6px solid #FF0080",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            {tool?.h1 ?? "Postkit"}
          </div>
          <div style={{ fontSize: 34, color: "#6E6E76", marginTop: 28 }}>
            Free, runs in your browser, nothing is uploaded.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderBottom: "6px solid #FF0080",
              borderLeft: "6px solid #FF0080",
            }}
          />
          <div
            style={{
              width: 40,
              height: 40,
              borderBottom: "6px solid #FF0080",
              borderRight: "6px solid #FF0080",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
