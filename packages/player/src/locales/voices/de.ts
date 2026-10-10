import type { PartialVoices } from "../../voices"

// de: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const de: PartialVoices = {
  default: {
    praise: {
      plain: ["Genau so"],
      flavor: [
        "Gut gemacht",
        "Exakt",
        "Richtig",
        "Volltreffer",
        "Das ist es",
        "Gut erkannt",
        "Sehr gut",
      ],
    },
    correctWithHint: {
      plain: ["Richtig, mit einem Tipp"],
      flavor: [
        "Mit Tipp ans Ziel",
        "Tipp genutzt, Antwort gefunden",
        "Schön herausgefunden",
      ],
    },
    goodGuess: {
      plain: ["Gut geraten!"],
      flavor: ["Gutes Gespür", "Gute Wahl", "Treffsicher geraten"],
    },
    hookMiss: {
      plain: ["Nicht ganz, und das ist okay"],
      flavor: [
        "Diesmal nicht, und das ist okay",
        "Guter Versuch. Schauen wir, warum",
        "Nicht ganz. Du siehst gleich, warum",
      ],
    },
    nudge: {
      plain: ["Schau noch einmal hin. Ich glaube, du findest es."],
      flavor: [
        "Nicht ganz. Schau noch mal hin.",
        "Fast. Versuch es noch einmal.",
        "Ein Blick noch, dann hast du es.",
      ],
    },
    close: {
      plain: ["Nah dran, aber nicht die beste"],
      flavor: [
        "Fast. Es gibt eine bessere",
        "Gut, aber nicht die beste",
        "Nah dran. Eine passt besser",
      ],
    },
    answer: {
      plain: ["Hier ist die Antwort"],
      flavor: [
        "So funktioniert es",
        "Schauen wir uns die Antwort an",
        "Die war knifflig. Hier ist sie",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Ahh! Es stimmt. Es stimmt wirklich"],
      flavor: [
        "Oh Mann, oh Mann, du hast es",
        "Ich fass es nicht, es hat geklappt",
        "Puh. Ich dachte, wir sind verloren",
        "Es stimmt. Keine Panik",
        "Mein Auge zuckt nicht mehr. Richtig",
        "Geschafft, und nichts ist explodiert",
        "Richtig. Mein Herz hält das nicht aus",
      ],
    },
    correctWithHint: {
      plain: ["Der Tipp hat uns beide gerettet"],
      flavor: [
        "Puh, Tipp und fertig. Ich zittere",
        "Wir brauchten Hilfe, und das ist okay",
        "Der Tipp hat geklappt. Echt geklappt",
      ],
    },
    goodGuess: {
      plain: ["Ahh! Woher wusstest du das?"],
      flavor: [
        "Moment, du wusstest es einfach?",
        "Das war zu gut geraten",
        "Wie? Beobachtest du mich?",
      ],
    },
    hookMiss: {
      plain: ["Ahh! Alles gut. Alles total gut"],
      flavor: [
        "Falsch, aber nur geraten. Atmen",
        "Hat keiner gesehen. Weiter",
        "Keine Sorge, ich mach mir die Sorgen",
      ],
    },
    nudge: {
      plain: ["Ahh! Nicht die. Schau noch mal"],
      flavor: [
        "Oh nein, oh nein. Noch ein Blick?",
        "Okay, tief durchatmen. Schau noch mal",
        "Nicht das, aber das kriegst du noch hin",
      ],
    },
    close: {
      plain: ["So knapp. Warum immer so knapp?"],
      flavor: [
        "Fast. Das ist fast schlimmer",
        "Es gibt eine bessere, ich schwör's",
        "Knapp. Meine Nerven halten knapp nicht aus",
      ],
    },
    answer: {
      plain: ["Okay, okay, keine Panik. Hier ist sie"],
      flavor: [
        "Hier ist sie. Reden wir nie wieder davon",
        "Schnell, bevor sie verschwindet",
        "Puh. Okay. So funktioniert es",
      ],
    },
  },
}
