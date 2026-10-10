import type { PartialVoices } from "../../voices"

// nl: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const nl: PartialVoices = {
  default: {
    praise: {
      plain: ["Zo ja"],
      flavor: [
        "Goed gedaan",
        "Precies",
        "Je hebt het",
        "In de roos",
        "Dat is 'm",
        "Goed gezien",
        "Helemaal goed",
      ],
    },
    correctWithHint: {
      plain: ["Goed, met een hint"],
      flavor: [
        "Gelukt met een hint",
        "Hint gebruikt, antwoord gevonden",
        "Mooi uitgezocht",
      ],
    },
    goodGuess: {
      plain: ["Goed gegokt!"],
      flavor: ["Goed instinct", "Goede keuze", "Scherp gegokt"],
    },
    hookMiss: {
      plain: ["Niet helemaal, en dat geeft niet"],
      flavor: [
        "Deze keer niet, en dat geeft niet",
        "Goede poging. Laten we kijken waarom",
        "Niet helemaal. Je ziet zo waarom",
      ],
    },
    nudge: {
      plain: ["Kijk nog eens goed. Ik denk dat je het ziet."],
      flavor: [
        "Niet helemaal. Kijk nog eens.",
        "Bijna. Probeer het nog eens.",
        "Nog één keer kijken moet lukken.",
      ],
    },
    close: {
      plain: ["Dichtbij, maar niet de beste"],
      flavor: [
        "Bijna. Er is een betere",
        "Goed, maar niet de beste",
        "Dichtbij. Eén optie past beter",
      ],
    },
    answer: {
      plain: ["Dit is het antwoord"],
      flavor: [
        "Zo zit het",
        "Laten we naar het antwoord kijken",
        "Lastige. Hier is het antwoord",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Aah! Het klopt. Het klopt echt"],
      flavor: [
        "O jee, o jee, het is gelukt",
        "Ik kan niet geloven dat dat werkte",
        "Pfoe. Ik dacht dat we verloren waren",
        "Het is goed. Niemand in paniek",
        "Mijn oog trilt niet meer. Goed",
        "Gelukt en er ontplofte niks",
        "Goed. Mijn hart kan dit niet aan",
      ],
    },
    correctWithHint: {
      plain: ["De hint heeft ons allebei gered"],
      flavor: [
        "Pfoe, hint en klaar. Ik tril",
        "We hadden hulp nodig, en dat mag",
        "De hint werkte. Hij werkte echt",
      ],
    },
    goodGuess: {
      plain: ["Aah! Hoe wist je dat?"],
      flavor: [
        "Wacht, je wist het gewoon?",
        "Die gok was te goed",
        "Hoe? Hou je me in de gaten?",
      ],
    },
    hookMiss: {
      plain: ["Aah! Het is goed. Het is helemaal goed"],
      flavor: [
        "Fout, maar het is maar een gok. Adem",
        "Niemand heeft het gezien. Door",
        "Geen zorgen, ik maak me zorgen voor je",
      ],
    },
    nudge: {
      plain: ["Aah! Niet die. Kijk nog eens"],
      flavor: [
        "O nee, o nee. Nog een keer kijken?",
        "Oké, diep ademhalen. Kijk nog eens",
        "Niet deze, maar het is nog te redden",
      ],
    },
    close: {
      plain: ["Zo dichtbij. Waarom altijd zo dichtbij?"],
      flavor: [
        "Bijna. Dat is bijna erger",
        "Er is een betere, echt waar",
        "Dichtbij. Mijn zenuwen trekken dit niet",
      ],
    },
    answer: {
      plain: ["Oké, oké, geen paniek. Hier is het"],
      flavor: [
        "Hier is het. We praten er nooit meer over",
        "Snel, voor het verdwijnt",
        "Pfoe. Oké. Zo werkt het",
      ],
    },
  },
}
