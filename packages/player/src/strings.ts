// The player's own text (buttons, feedback titles, helper lines), translated by the player.
// Lesson content stays in the lesson's language.

export type Strings = {
  start: string
  check: string
  continue: string
  tryAgain: string
  nudge: string
  praise: string[]
  why: string
  getHelp: string
  hint: string
  correct: string
  correctWithHint: string
  notQuite: string
  close: string
  answer: string
  goodGuess: string
  hookMiss: string
  hookNote: string
  minutes: (n: number) => string
  expires: (hours: number) => string
  levels: Record<"beginner" | "intermediate" | "advanced", string>
  objective: string
  warmUp: string
  concept: (i: number, n: number) => string
  practice: string
  challenge: string
  fixing: string
  keyTerm: string
  helper: {
    choiceOne: string
    choiceMany: string
    compare: string
    hotspot: string
    hotspotLine: string
    sort: string
    order: string
    match: string
    blank: string
    scenario: string
  }
  miss: {
    missOne: string
    hotspot: string
    hotspotLine: string
    sort: (n: number) => string
    order: string
    match: (n: number) => string
    blank: string
  }
  optionLabel: (letter: string) => string
  pool: string
  allPlaced: string
  dropHere: string
  wordBank: string
  emptyGap: string
  fixTitle: string
  fixBody: (n: number) => string
  fixStart: string
  done: string
  firstTry: string
  withHint: string
  secondTry: string
  missed: string
  takeaways: string
  next: string
  restart: string
  progress: string
  restartTitle: string
  restartBody: string
  stay: string
  home: string
  share: string
  docs: string
  createLesson: string
  part: (i: number, n: number) => string
  linkCopied: string
  theory: string
  theoryEmpty: string
  closeTheory: string
  by: string
  textSize: string
  sizes: Record<TextSize, string>
  sizesShort: Record<TextSize, string>
  theme: string
  themes: Record<Theme, string>
  language: string
}

export type TextSize = "sm" | "md" | "lg"
export type Theme = "system" | "light" | "dark"

const en: Strings = {
  start: "Start lesson",
  check: "Check answer",
  continue: "Continue",
  tryAgain: "Try again",
  nudge: "Give it one more look. I think you can catch it.",
  praise: ["There you go", "Nice work", "Exactly", "You got it", "Spot on"],
  why: "Why?",
  getHelp: "Get help",
  hint: "Hint",
  correct: "Correct!",
  correctWithHint: "Correct, with a hint",
  notQuite: "Not quite",
  close: "Close, but not the best",
  answer: "Here's the answer",
  goodGuess: "Good guess!",
  hookMiss: "Not quite, and that's fine",
  hookNote: "This first one is a warm-up. It doesn't count toward your score.",
  minutes: (n) => `${n} min`,
  expires: (h) => `Expires in ${h}h`,
  levels: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },
  objective: "You'll be able to",
  warmUp: "Warm-up guess",
  concept: (i, n) => `Concept ${i} of ${n}`,
  practice: "Practice",
  challenge: "Challenge",
  fixing: "Fixing mistakes",
  keyTerm: "Key term",
  helper: {
    choiceOne: "Pick one.",
    choiceMany: "Pick all that apply.",
    compare: "Pick the better one.",
    hotspot: "Tap the right part.",
    hotspotLine: "Tap the right line.",
    sort: "Drag each item into its group. With a keyboard, press Enter on an item's handle, then Tab to a group.",
    order:
      "Drag the items into order. With a keyboard, press Enter on a handle, then Tab to a new spot.",
    match: "Tap an item, then tap its match.",
    blank: "Tap a word to fill each gap.",
    scenario: "Choose what you'd do.",
  },
  miss: {
    missOne: "You're missing one.",
    hotspot: "Not that one. Take another look.",
    hotspotLine: "Not that line. Take another look.",
    sort: (n) =>
      n === 1
        ? "1 item is in the wrong group."
        : `${n} items are in the wrong group.`,
    order: "Some items are out of order.",
    match: (n) =>
      n === 1 ? "1 pair doesn't match." : `${n} pairs don't match.`,
    blank: "Check the highlighted gap.",
  },
  optionLabel: (l) => `Option ${l}`,
  pool: "Items to sort",
  allPlaced: "All placed",
  dropHere: "Drop items here",
  wordBank: "Word bank",
  emptyGap: "Empty gap",
  fixTitle: "Let's fix your mistakes",
  fixBody: (n) =>
    n === 1
      ? "One question is coming back. Give it another go before the wrap-up."
      : `${n} questions are coming back. Give them another go before the wrap-up.`,
  fixStart: "Start",
  done: "Lesson complete!",
  firstTry: "right on the first try",
  withHint: "with a hint",
  secondTry: "on the second try",
  missed: "missed",
  takeaways: "Key takeaways",
  next: "Suggested next lesson",
  restart: "Restart lesson",
  progress: "Lesson progress",
  restartTitle: "Restart this lesson?",
  restartBody:
    "You'll start again from the beginning. Your answers so far won't be kept.",
  stay: "Keep learning",
  home: "Learn home",
  share: "Share",
  docs: "Docs",
  createLesson: "Create lesson",
  part: (i, n) => `Part ${i} of ${n}`,
  linkCopied: "Link copied",
  theory: "Theory",
  theoryEmpty: "Concepts show up here as you learn them.",
  closeTheory: "Close theory",
  by: "by",
  textSize: "Text size",
  sizes: { sm: "Small", md: "Medium", lg: "Large" },
  sizesShort: { sm: "Sm", md: "Md", lg: "Lg" },
  theme: "Theme",
  themes: { system: "System", light: "Light", dark: "Dark" },
  language: "Language",
}

const ar: Strings = {
  start: "ابدأ الدرس",
  check: "تحقّق من الإجابة",
  continue: "متابعة",
  tryAgain: "حاول مرة أخرى",
  nudge: "ألقِ نظرة أخرى، أظنك ستجدها.",
  praise: ["أحسنت", "عمل رائع", "بالضبط", "إجابة موفقة", "في الصميم"],
  why: "لماذا؟",
  getHelp: "احصل على مساعدة",
  hint: "تلميح",
  correct: "إجابة صحيحة!",
  correctWithHint: "صحيحة، بمساعدة تلميح",
  notQuite: "ليس تمامًا",
  close: "قريب، لكنه ليس الأفضل",
  answer: "إليك الإجابة",
  goodGuess: "تخمين جيد!",
  hookMiss: "ليس تمامًا، ولا بأس بذلك",
  hookNote: "هذا سؤال تمهيدي، ولا يُحتسب في نتيجتك.",
  minutes: (n) => `${n} دقائق`,
  expires: (h) => `ينتهي خلال ${h} ساعة`,
  levels: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" },
  objective: "ستتمكن من",
  warmUp: "تخمين تمهيدي",
  concept: (i, n) => `المفهوم ${i} من ${n}`,
  practice: "تدريب",
  challenge: "تحدٍّ",
  fixing: "تصحيح الأخطاء",
  keyTerm: "مصطلح أساسي",
  helper: {
    choiceOne: "اختر إجابة واحدة.",
    choiceMany: "اختر كل ما ينطبق.",
    compare: "اختر الأفضل.",
    hotspot: "اضغط على الجزء الصحيح.",
    hotspotLine: "اضغط على السطر الصحيح.",
    sort: "اسحب كل عنصر إلى مجموعته. باستخدام لوحة المفاتيح، اضغط Enter على مقبض العنصر ثم Tab إلى المجموعة.",
    order:
      "اسحب العناصر لترتيبها. باستخدام لوحة المفاتيح، اضغط Enter على المقبض ثم Tab إلى موضع جديد.",
    match: "اضغط على عنصر، ثم على ما يطابقه.",
    blank: "اضغط على كلمة لملء كل فراغ.",
    scenario: "اختر ما ستفعله.",
  },
  miss: {
    missOne: "فاتك خيار.",
    hotspot: "ليس هذا. أعد النظر.",
    hotspotLine: "ليس هذا السطر. أعد النظر.",
    sort: (n) => `${n} من العناصر في المجموعة الخطأ.`,
    order: "بعض العناصر ليست في مكانها الصحيح.",
    match: (n) => `${n} من الأزواج غير متطابقة.`,
    blank: "راجع الفراغ المحدد.",
  },
  optionLabel: (l) => `الخيار ${l}`,
  pool: "عناصر للتصنيف",
  allPlaced: "تم وضع كل العناصر",
  dropHere: "أفلت العناصر هنا",
  wordBank: "بنك الكلمات",
  emptyGap: "فراغ",
  fixTitle: "لنصحّح أخطاءك",
  fixBody: (n) => `سيعود ${n} من الأسئلة. جرّبها مرة أخرى قبل الختام.`,
  fixStart: "ابدأ",
  done: "أكملت الدرس!",
  firstTry: "صحيحة من المحاولة الأولى",
  withHint: "بمساعدة تلميح",
  secondTry: "في المحاولة الثانية",
  missed: "فاتتك",
  takeaways: "أهم النقاط",
  next: "الدرس التالي المقترح",
  restart: "أعد الدرس",
  progress: "تقدم الدرس",
  restartTitle: "هل تريد إعادة هذا الدرس؟",
  restartBody: "ستبدأ من جديد، ولن تُحفظ إجاباتك حتى الآن.",
  stay: "تابع التعلم",
  home: "الصفحة الرئيسية",
  share: "مشاركة",
  docs: "الدليل",
  createLesson: "أنشئ درسًا",
  part: (i, n) => `الجزء ${i} من ${n}`,
  linkCopied: "تم نسخ الرابط",
  theory: "النظرية",
  theoryEmpty: "ستظهر المفاهيم هنا أثناء تعلّمك.",
  closeTheory: "إغلاق النظرية",
  by: "بواسطة",
  textSize: "حجم النص",
  sizes: { sm: "صغير", md: "متوسط", lg: "كبير" },
  sizesShort: { sm: "صغير", md: "متوسط", lg: "كبير" },
  theme: "المظهر",
  themes: { system: "النظام", light: "فاتح", dark: "داكن" },
  language: "اللغة",
}

const STRINGS: Record<string, Strings> = { en, ar }

/** Languages the player's own text is translated into, with their names for the language menu. */
export const UI_LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "ar", label: "العربية" },
] as const

/** The menu entry for a language code, or undefined when the player has no translation for it. */
export function uiLanguageFor(lang: string) {
  const base = lang.toLowerCase().split("-")[0]
  return UI_LANGUAGES.find((l) => l.code === base)
}

/** The player's text for a language code ("ar", "ar-EG", "en-US"…), falling back to English. */
export function stringsFor(lang: string): Strings {
  return STRINGS[lang.toLowerCase().split("-")[0]!] ?? en
}

/** React Aria's locale for a UI language. React Aria ships Arabic as ar-AE. */
export function ariaLocaleFor(lang: string): string {
  const base = lang.toLowerCase().split("-")[0]
  return base === "ar" ? "ar-AE" : lang
}
