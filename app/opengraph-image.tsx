import { ImageResponse } from "next/og";

export const alt = "Fraga Saga – Gratis offertanalys pa sekunder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
        }}
      >
        {/* Purple glow */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: "50%",
            width: 500,
            height: 300,
            background: "rgba(99,102,241,0.25)",
            borderRadius: "50%",
            filter: "blur(80px)",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#6366f1",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
            position: "relative",
          }}
        >
          Offertanalys pa sekunder
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 28,
            position: "relative",
          }}
        >
          Fraga Saga
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            position: "relative",
          }}
        >
          Ladda upp din offert. Gratis prisanalys och foretagskoll.
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
            position: "relative",
          }}
        >
          {["Sparas aldrig", "Myndighetsdata", "Svar pa 10 sek"].map((badge) => (
            <div
              key={badge}
              style={{
                padding: "10px 24px",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                fontSize: 20,
                fontWeight: 600,
                color: "#cbd5e1",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
