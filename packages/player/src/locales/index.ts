import type { Strings, UiLanguage } from "../strings"

import { ar } from "./ar"
import { de } from "./de"
import { en } from "./en"
import { es } from "./es"
import { fr } from "./fr"
import { he } from "./he"
import { hi } from "./hi"
import { id } from "./id"
import { it } from "./it"
import { ja } from "./ja"
import { ko } from "./ko"
import { nl } from "./nl"
import { pl } from "./pl"
import { pt } from "./pt"
import { ru } from "./ru"
import { th } from "./th"
import { tr } from "./tr"
import { uk } from "./uk"
import { vi } from "./vi"
import { zh } from "./zh"
import { zhTw } from "./zh-tw"

/** Every language the player speaks, by its code in UI_LANGUAGES. */
export const STRINGS: Record<UiLanguage, Strings> = {
  en,
  es,
  pt,
  fr,
  de,
  it,
  nl,
  pl,
  ru,
  uk,
  tr,
  ar,
  he,
  hi,
  id,
  vi,
  th,
  ja,
  ko,
  zh,
  "zh-tw": zhTw,
}
