import { OG_SIZE, siteImage } from "@/lib/og"
import { SITE } from "@/lib/site"

export const alt = `${SITE.name}: ${SITE.tagline}`
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return siteImage()
}
