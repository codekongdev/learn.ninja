import type { Voices } from "../../voices"

// Nederlands (je). Default is kort en duidelijk, Sensei een kalme leermeester, en Unhinged een
// zenuwpees die praat zoals mensen praten, niet zoals je vertaalt.

export const nl: Voices = {
  default: {
    praise: {
      plain: ["Goed.", "Dat klopt."],
      flavor: [
        "Goed gedaan!",
        "Precies.",
        "Je hebt hem.",
        "In de roos.",
        "Goed gezien.",
        "Zo ja.",
        "Dat is 'm.",
        "Heel goed.",
      ],
    },
    correctWithHint: {
      plain: ["Goed, met een hint."],
      flavor: [
        "De hint heeft zijn werk gedaan.",
        "Netjes uitgedacht.",
        "Met een hint, maar je bent er.",
      ],
    },
    goodGuess: {
      plain: ["Goed gegokt!"],
      flavor: ["Goed instinct.", "Goede keuze.", "Scherp gegokt."],
    },
    hookMiss: {
      plain: ["Niet helemaal, en dat geeft niet."],
      flavor: [
        "Goede poging. Eens kijken waarom.",
        "Niet helemaal. Je ziet zo waarom.",
      ],
    },
    nudge: {
      plain: ["Niet helemaal. Kijk nog eens."],
      flavor: [
        "Bijna. Probeer het nog eens.",
        "Nog één blik en je hebt hem.",
        "Kijk nog eens goed. Ik denk dat je het ziet.",
      ],
    },
    close: {
      plain: ["Dichtbij, maar niet de beste."],
      flavor: [
        "Bijna. Een andere optie past beter.",
        "Goed, maar niet de beste.",
      ],
    },
    answer: {
      plain: ["Hier is het antwoord."],
      flavor: [
        "Zo werkt het.",
        "Deze was lastig. Hier is hij.",
        "Laten we naar het antwoord kijken.",
      ],
    },
    streak: {
      plain: ["Drie op rij."],
      flavor: ["Je bent op dreef.", "Dat is een reeks."],
    },
    comeback: {
      plain: ["Daar is hij."],
      flavor: ["Deze keer wel.", "Goed hersteld."],
    },
    last: {
      plain: ["De laatste, en hij klopt."],
      flavor: ["Dat was de les.", "Sterk afgesloten."],
    },
    perfect: {
      plain: ["Alles goed."],
      flavor: ["Zonder één fout.", "Niets te verbeteren."],
    },
  },
  sensei: {
    praise: {
      plain: ["Goed. Dat is het.", "Ja."],
      flavor: [
        "Je zag het.",
        "Goed waargenomen.",
        "Precies zo.",
        "Je oog wordt scherper.",
        "Ja. Stil en zeker.",
        "Dat is de weg.",
        "Goed. Houd dat vast.",
      ],
    },
    correctWithHint: {
      plain: ["Goed. De hint wees de weg, jij liep hem."],
      flavor: [
        "Vragen is ook een vaardigheid.",
        "Hulp aangenomen, les onthouden.",
        "Een hint is een hand, geen kruk.",
      ],
    },
    goodGuess: {
      plain: ["Een goede gok."],
      flavor: [
        "Je instinct weet dingen die jij nog niet weet.",
        "Vertrouw het gevoel, toets het daarna.",
        "Goed gegokt. Nu kijken we waarom.",
      ],
    },
    hookMiss: {
      plain: ["Nog niet, en daar gaat het om."],
      flavor: [
        "Een gok laat zien waar we beginnen.",
        "Geeft niet. De les begint hier.",
      ],
    },
    nudge: {
      plain: ["Nog niet. Kijk nog eens."],
      flavor: [
        "Rustig. Het is er.",
        "Adem, kijk dan opnieuw.",
        "Het antwoord is niet verplaatst.",
      ],
    },
    close: {
      plain: ["Dichtbij. Eén past beter."],
      flavor: ["Goed oog. Zoek nu de beste.", "Bijna. Zoek de scherpere."],
    },
    answer: {
      plain: ["Hier is het antwoord."],
      flavor: [
        "Blijf hier even bij stilstaan.",
        "De moeilijke leren het meest. Hier is hij.",
        "Hier is het antwoord. Lees het rustig.",
      ],
    },
    streak: {
      plain: ["Drie op rij. Rustig aan."],
      flavor: ["Je hebt je ritme gevonden.", "Kalme handen, heldere blik."],
    },
    comeback: {
      plain: ["Je keek nog eens, en daar was het."],
      flavor: ["Zo leer je.", "De tweede blik is de les."],
    },
    last: {
      plain: ["En dat is de les. Goed gelopen."],
      flavor: [
        "De laatste stap is ook een stap.",
        "Je hebt afgemaakt wat je begon.",
      ],
    },
    perfect: {
      plain: ["Geen misstap. Neem dat mee."],
      flavor: [
        "Een kalme geest ziet helder.",
        "Niets te verbeteren. Alleen te onthouden.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Goed. Ademhalen.", "Het klopt. Niemand in paniek."],
      flavor: [
        "Pfoe! Het klopt. Het klopt echt!",
        "Jeetje, je hebt het gedaan!",
        "Ik kan niet geloven dat dat werkte.",
        "Pfff. Ik dacht dat we verloren waren.",
        "Mijn oog is gestopt met trillen. Goed.",
        "Gelukt, en er is niets ontploft!",
        "Goed. Mijn hart trekt dit niet.",
      ],
    },
    correctWithHint: {
      plain: ["Hint. Goed. Ademhalen."],
      flavor: [
        "De hint heeft ons allebei gered.",
        "Pfoe, hint en klaar. Ik tril.",
        "De hint werkte. Hij werkte echt!",
      ],
    },
    goodGuess: {
      plain: ["Wacht, je wist het gewoon?"],
      flavor: [
        "Pfoe! Hoe wist je dat?",
        "Die gok was te goed.",
        "Hoe dan? Zit je me te bespieden?",
      ],
    },
    hookMiss: {
      plain: ["Het is oké. Het is echt oké."],
      flavor: [
        "Fout, maar het was maar een gok. Ademhalen.",
        "Niemand heeft het gezien. Door.",
        "Rustig maar, ik maak me wel zorgen voor je.",
      ],
    },
    nudge: {
      plain: ["Die niet. Kijk nog eens."],
      flavor: [
        "O nee, o nee. Nog één blik?",
        "Oké, diep ademhalen. Kijk nog eens.",
        "Niet die, maar je kunt het nog redden.",
      ],
    },
    close: {
      plain: ["Zo dichtbij. Waarom altijd zo dichtbij?"],
      flavor: [
        "Bijna. Dat is bijna erger.",
        "Er is een betere, ik zweer het.",
        "Dichtbij. Mijn zenuwen trekken dichtbij niet.",
      ],
    },
    answer: {
      plain: ["Oké, geen paniek. Hier is hij."],
      flavor: [
        "Hier is hij. Laten we het er nooit meer over hebben.",
        "Snel, voordat hij verdwijnt!",
        "Pfoe. Oké. Zo werkt het.",
      ],
    },
    streak: {
      plain: ["Drie op rij? Wie BEN jij?"],
      flavor: ["Stop, stop, ik trek geen reeks!", "Drie! Ik moet even zitten."],
    },
    comeback: {
      plain: ["Je bent terug. Van DAT."],
      flavor: [
        "Opgelost. Ik twijfel nooit meer aan je. Tot de volgende keer.",
        "Pfoe. Ik dacht dat die ons te pakken had.",
      ],
    },
    last: {
      plain: ["Het is voorbij. We hebben het gehaald."],
      flavor: ["Ik moet even liggen.", "De laatste. Mijn knieën begaven het."],
    },
    perfect: {
      plain: ["Perfect. PERFECT. Ik moet even zitten."],
      flavor: ["Niets ontploft. Niet één keer.", "Allemaal? Ik val flauw."],
    },
  },
}
