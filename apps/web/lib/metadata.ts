import type { Metadata } from "next"

import { SITE } from "@/lib/site"

/**
 * A lesson page's link preview fields: its canonical URL and its Open Graph object, with the
 * lesson's BCP 47 `language`. Next merges metadata shallowly, so setting `openGraph` replaces the
 * layout's whole object, including the site card from app/opengraph-image.tsx. That's why only
 * lesson pages, which bring their own card, use this; other pages set just `alternates.canonical`.
 */
export function shareMetadata(
  path: string,
  language = "en"
): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE.name,
      type: "website",
      url: path,
      locale: ogLocale(language),
    },
  }
}

/** Open Graph wants language_TERRITORY ("es_ES"); a bare "es" gets its likely region. */
export function ogLocale(language: string): string | undefined {
  try {
    const { language: lang, region } = new Intl.Locale(language).maximize()
    return region ? `${lang}_${region}` : lang
  } catch {
    return undefined
  }
}
