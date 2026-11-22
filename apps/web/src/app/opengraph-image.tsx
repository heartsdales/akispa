import { ImageResponse } from "next/og";
import { maxDiscount } from "@/lib/booking";
import { site } from "@/lib/site";

export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #203a31 0%, #382b32 100%)",
          color: "#fffdf9",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, color: "#f3ebde" }}>REST · RESTORE · RECONNECT</div>
        <div style={{ fontSize: 128, letterSpacing: 12, marginTop: 24 }}>{site.brand}</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#f3ebde" }}>Gaya Street · Kota Kinabalu</div>
        <div
          style={{
            marginTop: 48,
            padding: "16px 36px",
            borderRadius: 999,
            background: "#e71b7c",
            fontSize: 30,
            fontFamily: "sans-serif",
          }}
        >
          {`Book online · save up to ${maxDiscount}%`}
        </div>
      </div>
    ),
    size,
  );
}
