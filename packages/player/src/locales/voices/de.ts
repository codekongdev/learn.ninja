import type { Voices } from "../../voices"

// Deutsch (du). Default ist kurz und klar, Sensei ein ruhiger Lehrmeister, und Unhinged ein
// Nervenbündel, das redet, wie man redet, nicht wie man übersetzt.

export const de: Voices = {
  default: {
    praise: {
      plain: ["Richtig.", "Genau so."],
      flavor: [
        "Gut gemacht!",
        "Genau.",
        "Du hast es.",
        "Volltreffer.",
        "Gut erkannt.",
        "Na bitte.",
        "Das ist es.",
        "Sehr gut.",
      ],
    },
    correctWithHint: {
      plain: ["Richtig, mit einem Tipp."],
      flavor: [
        "Der Tipp hat seinen Zweck erfüllt.",
        "Sauber gelöst.",
        "Mit Tipp, aber geschafft.",
      ],
    },
    goodGuess: {
      plain: ["Gut geraten!"],
      flavor: ["Guter Instinkt.", "Gute Wahl.", "Treffsicher geraten."],
    },
    hookMiss: {
      plain: ["Nicht ganz, und das ist okay."],
      flavor: [
        "Guter Versuch. Schauen wir, warum.",
        "Nicht ganz. Du siehst gleich, warum.",
      ],
    },
    nudge: {
      plain: ["Nicht ganz. Schau noch einmal hin."],
      flavor: [
        "Fast. Versuch es noch einmal.",
        "Noch ein Blick, dann hast du es.",
        "Schau noch einmal hin. Ich glaube, du findest es.",
      ],
    },
    close: {
      plain: ["Nah dran, aber nicht die beste."],
      flavor: [
        "Fast. Eine andere Option passt besser.",
        "Gut, aber nicht die beste.",
      ],
    },
    answer: {
      plain: ["Hier ist die Antwort."],
      flavor: [
        "So funktioniert es.",
        "Die war knifflig. Hier ist sie.",
        "Schauen wir uns die Antwort an.",
      ],
    },
    streak: {
      plain: ["Drei in Folge."],
      flavor: ["Du bist im Flow.", "Das ist eine Serie."],
    },
    comeback: {
      plain: ["Da ist es."],
      flavor: ["Diesmal sitzt es.", "Gut aufgeholt."],
    },
    last: {
      plain: ["Die letzte, und sie stimmt."],
      flavor: ["Das war die Lektion.", "Stark zu Ende gebracht."],
    },
    perfect: {
      plain: ["Alles richtig."],
      flavor: ["Ohne einen einzigen Fehler.", "Nichts zu korrigieren."],
    },
  },
  sensei: {
    praise: {
      plain: ["Gut. Das ist es.", "Ja."],
      flavor: [
        "Du hast es gesehen.",
        "Gut beobachtet.",
        "Genau so.",
        "Dein Blick wird schärfer.",
        "Ja. Still und sicher.",
        "Das ist der Weg.",
        "Gut. Behalte das.",
      ],
    },
    correctWithHint: {
      plain: ["Richtig. Der Tipp zeigte den Weg, du bist ihn gegangen."],
      flavor: [
        "Fragen ist auch eine Fähigkeit.",
        "Hilfe angenommen, Lektion behalten.",
        "Ein Tipp ist eine Hand, keine Krücke.",
      ],
    },
    goodGuess: {
      plain: ["Gut geraten."],
      flavor: [
        "Dein Instinkt weiß Dinge, die du noch nicht weißt.",
        "Vertrau dem Gefühl, dann prüfe es.",
        "Gut geraten. Nun sehen wir, warum.",
      ],
    },
    hookMiss: {
      plain: ["Noch nicht, und genau darum geht es."],
      flavor: [
        "Eine Vermutung zeigt uns, wo wir anfangen.",
        "Macht nichts. Die Lektion beginnt hier.",
      ],
    },
    nudge: {
      plain: ["Noch nicht. Schau noch einmal."],
      flavor: [
        "Langsam. Es ist da.",
        "Atme, dann schau noch einmal.",
        "Die Antwort hat sich nicht bewegt.",
      ],
    },
    close: {
      plain: ["Nah dran. Eine passt besser."],
      flavor: ["Gutes Auge. Nun finde die beste.", "Fast. Such die schärfere."],
    },
    answer: {
      plain: ["Hier ist die Antwort."],
      flavor: [
        "Bleib einen Moment bei dieser.",
        "Die schweren lehren am meisten. Hier ist sie.",
        "Hier ist die Antwort. Lies sie langsam.",
      ],
    },
    streak: {
      plain: ["Drei in Folge. Ruhig weiter."],
      flavor: [
        "Du hast deinen Rhythmus gefunden.",
        "Ruhige Hände, klarer Blick.",
      ],
    },
    comeback: {
      plain: ["Du hast noch einmal hingesehen, und da war es."],
      flavor: ["So lernt man.", "Der zweite Blick ist die Lektion."],
    },
    last: {
      plain: ["Und das ist die Lektion. Gut gegangen."],
      flavor: [
        "Der letzte Schritt ist auch ein Schritt.",
        "Du hast beendet, was du begonnen hast.",
      ],
    },
    perfect: {
      plain: ["Kein einziger Fehltritt. Nimm das mit."],
      flavor: [
        "Ein ruhiger Geist sieht klar.",
        "Nichts zu korrigieren. Nur zu behalten.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Richtig. Durchatmen.", "Es stimmt. Keine Panik."],
      flavor: [
        "Ah! Es stimmt. Es stimmt wirklich!",
        "Oh Mann, oh Mann, du hast es geschafft!",
        "Ich fass es nicht, dass das geklappt hat.",
        "Puh. Ich dachte, wir sind erledigt.",
        "Mein Auge hat aufgehört zu zucken. Richtig.",
        "Geschafft, und nichts ist explodiert!",
        "Richtig. Mein Herz hält das nicht aus.",
      ],
    },
    correctWithHint: {
      plain: ["Tipp. Richtig. Durchatmen."],
      flavor: [
        "Der Tipp hat uns beide gerettet.",
        "Puh, Tipp und fertig. Ich zittere.",
        "Der Tipp hat funktioniert. Er hat wirklich funktioniert!",
      ],
    },
    goodGuess: {
      plain: ["Moment, du wusstest das einfach?"],
      flavor: [
        "Ah! Woher wusstest du das?",
        "Das war zu gut geraten.",
        "Wie? Beobachtest du mich?",
      ],
    },
    hookMiss: {
      plain: ["Alles gut. Wirklich, alles gut."],
      flavor: [
        "Falsch, aber nur geraten. Durchatmen.",
        "Hat keiner gesehen. Weiter.",
        "Keine Sorge, ich sorge mich für dich.",
      ],
    },
    nudge: {
      plain: ["Die nicht. Schau noch mal."],
      flavor: [
        "Oh nein, oh nein. Noch ein Blick?",
        "Okay, tief durchatmen. Schau noch mal.",
        "Nicht die, aber du kannst es noch retten.",
      ],
    },
    close: {
      plain: ["So knapp. Warum immer so knapp?"],
      flavor: [
        "Fast. Das ist fast schlimmer.",
        "Es gibt eine bessere, ich schwöre.",
        "Knapp. Meine Nerven halten knapp nicht aus.",
      ],
    },
    answer: {
      plain: ["Okay, keine Panik. Hier ist sie."],
      flavor: [
        "Hier ist sie. Reden wir nie wieder darüber.",
        "Schnell, bevor sie verschwindet!",
        "Puh. Okay. So funktioniert es.",
      ],
    },
    streak: {
      plain: ["Drei in Folge? Wer BIST du?"],
      flavor: [
        "Stopp, stopp, ich halte keine Serie aus!",
        "Drei! Ich muss mich setzen.",
      ],
    },
    comeback: {
      plain: ["Du bist zurück. Nach DEM."],
      flavor: [
        "Gerettet. Ich zweifle nie wieder an dir. Bis zum nächsten Mal.",
        "Puh. Ich dachte, die hätte uns erwischt.",
      ],
    },
    last: {
      plain: ["Vorbei. Wir haben es geschafft."],
      flavor: ["Ich muss mich hinlegen.", "Die letzte. Meine Knie sind weich."],
    },
    perfect: {
      plain: ["Perfekt. PERFEKT. Ich muss mich setzen."],
      flavor: [
        "Nichts ist explodiert. Kein einziges Mal.",
        "Alle? Ich fall gleich um.",
      ],
    },
  },
}
