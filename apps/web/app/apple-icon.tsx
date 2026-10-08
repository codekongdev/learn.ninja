import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// iOS rounds the corners itself and fills transparency with black, so the
// tile is a full square. The logo is the same mark as icon.svg.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          <g stroke="#fafafa" strokeWidth="5" strokeLinejoin="round">
            <path d="M7.01 24.83A26 26 0 0 1 56.99 24.83Q32 15.17 7.01 24.83Z" />
            <path d="M56.99 39.17Q32 48.83 7.01 39.17A26 26 0 0 0 56.99 39.17Z" />
          </g>
          <ellipse cx="25" cy="32" rx="2.9" ry="4.6" fill="#fafafa" />
          <ellipse cx="39" cy="32" rx="2.9" ry="4.6" fill="#fafafa" />
        </svg>
      </div>
    ),
    size
  )
}
