import { ImageResponse } from "next/og";

export const alt = "Jayden Dwi Naufal — Full-Stack Developer & Data Scientist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
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
              fontSize: 26,
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
                width: 14,
                height: 14,
                backgroundColor: "#000000",
                borderRadius: "50%",
              }}
            />
            Individev
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#666666",
            }}
          >
            Portfolio &bull; 2026
          </div>
        </div>

        {/* Center / Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            Jayden Dwi Naufal
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#444444",
              fontWeight: 400,
              lineHeight: 1.3,
            }}
          >
            Full-Stack Developer &amp; Data Scientist
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#666666",
              marginTop: 4,
            }}
          >
            1st Place Provincial LKS &bull; Medallion of Excellence National LKSN IT Software
          </div>
        </div>

        {/* Footer / Skills */}
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
          <div style={{ display: "flex", gap: 12 }}>
            {["Next.js", "React", "TypeScript", "Python", "ASP.NET", "Compose"].map(
              (tech) => (
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
              )
            )}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#333333",
              letterSpacing: "0.05em",
            }}
          >
            jaydendwinaufal.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
