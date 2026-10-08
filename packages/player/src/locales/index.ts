import type { Strings, UiLanguage } from "../strings"

import { ar } from "./ar"
import { en } from "./en"

/** Every language the player speaks, by its code in UI_LANGUAGES. A language without a file yet reads as English. */
const translated: Partial<Record<UiLanguage, Strings>> = { en, ar }

export const STRINGS: Record<UiLanguage, Strings> = new Proxy(
  translated as Record<UiLanguage, Strings>,
  { get: (target, code) => target[code as UiLanguage] ?? en }
)
