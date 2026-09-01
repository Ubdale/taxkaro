import { ImageResponse } from "next/og";
import { IT_EXPORT, TAX_YEAR } from "@/lib/tax-rates";

export const alt =
  "TaxKaro — freelancer tax calculator for Pakistan, updated for tax year 2026–27";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Rendered once at build time into a static PNG.
 *
 * Satori (what ImageResponse runs on) supports a deliberately small slice of
 * CSS: every element with children needs an explicit `display: flex`, and there
 * is no gradient masking, so the receipt's torn edge is drawn as a row of
 * triangles rather than the radial-gradient trick the site itself uses.
 */
export default function OpengraphImage() {
  // Satori treats adjacent text and an interpolation as two child nodes, which
  // then demands display:flex on the parent. Precomputing the string keeps each
  // text element a single child.
  const subline = `Freelancers are not on the salaried slabs — and exporting IT services can mean ${
    IT_EXPORT.pseb * 100
  }% instead of 45%.`;
  const taxYearLabel = `Tax year ${TAX_YEAR}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#072a1d",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: the claim */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 640,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "#c9a227",
                  color: "#072a1d",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Rs
              </div>
              <div
                style={{
                  marginLeft: 14,
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: -0.5,
                }}
              >
                TaxKaro
              </div>
            </div>

            <div
              style={{
                marginTop: 44,
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              Know exactly what you owe FBR.
            </div>

            <div
              style={{
                marginTop: 26,
                fontSize: 25,
                lineHeight: 1.4,
                color: "#a7cfb8",
                maxWidth: 580,
              }}
            >
              {subline}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "9px 18px",
                borderRadius: 999,
                border: "2px solid #14583c",
                color: "#6fae90",
                fontSize: 20,
              }}
            >
              {taxYearLabel}
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 14,
                padding: "9px 18px",
                borderRadius: 999,
                border: "2px solid #14583c",
                color: "#6fae90",
                fontSize: 20,
              }}
            >
              Free · no signup
            </div>
          </div>
        </div>

        {/* Right: the slip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 56,
            width: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fffdf8",
              color: "#072a1d",
              padding: 32,
              paddingBottom: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 16,
                letterSpacing: 4,
                color: "#1f6f4d",
              }}
            >
              ESTIMATED TAX
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 26,
                paddingTop: 22,
                borderTop: "2px solid #dcdfd6",
                fontSize: 17,
                color: "#5d6b63",
              }}
            >
              Gross Rs 3,600,000
            </div>
            <div
              style={{ display: "flex", marginTop: 8, fontSize: 17, color: "#5d6b63" }}
            >
              154A · 0.25% final
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 26,
                paddingTop: 20,
                borderTop: "3px solid #072a1d",
                fontSize: 15,
                letterSpacing: 3,
                color: "#1f6f4d",
              }}
            >
              TOTAL PAYABLE
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: -1.5,
              }}
            >
              Rs 9,000
            </div>
          </div>

          {/* Torn bottom edge, drawn as triangles because satori has no mask. */}
          <div style={{ display: "flex" }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 14,
                  backgroundColor: "#fffdf8",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
