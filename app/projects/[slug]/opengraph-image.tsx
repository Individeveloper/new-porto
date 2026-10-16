import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title || "Project Case Study";
  const tag = project?.tag || "Featured Project";
  const year = project?.year || "2026";
  const summary =
    project?.summary ||
    "Explore case study details, architecture, and technology stack.";
  const technologies = project?.technologies || ["Next.js", "TypeScript", "Tailwind CSS"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#F2F2F2",
          color: "#000000",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative border frame */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: 16,
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.08em",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#000000",
                borderRadius: "50%",
              }}
            />
            Jayden Dwi Naufal &bull; Project
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#666666",
            }}
          >
            <span>{tag}</span>
            <span>&bull;</span>
            <span>{year}</span>
          </div>
        </div>

        {/* Center / Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#444444",
              fontWeight: 400,
              lineHeight: 1.35,
              maxWidth: 960,
            }}
          >
            {summary}
          </div>
        </div>

        {/* Footer / Tech stack */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {technologies.slice(0, 5).map((tech) => (
              <div
                key={tech}
                style={{
                  backgroundColor: "#EAE4D5",
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#555555",
              letterSpacing: "0.05em",
            }}
          >
            View Project Case Study &rarr;
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
