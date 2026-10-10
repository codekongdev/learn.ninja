import type { PartialVoices } from "../../voices"

// it: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const it: PartialVoices = {
  default: {
    praise: {
      plain: ["Ecco"],
      flavor: [
        "Ottimo lavoro",
        "Esatto",
        "Ci sei",
        "Perfetto",
        "Proprio quella",
        "Ben visto",
        "Giusto così",
      ],
    },
    correctWithHint: {
      plain: ["Corretto, con un suggerimento"],
      flavor: [
        "Con un suggerimento, ma ci sei",
        "Suggerimento usato, risposta trovata",
        "Ben ragionato",
      ],
    },
    goodGuess: {
      plain: ["Bella intuizione!"],
      flavor: ["Buon istinto", "Ben pensato", "Ottimo intuito"],
    },
    hookMiss: {
      plain: ["Non proprio, e va bene così"],
      flavor: [
        "Non stavolta, e va bene così",
        "Bel tentativo. Vediamo perché",
        "Non proprio. Presto vedrai perché",
      ],
    },
    nudge: {
      plain: ["Dai un'altra occhiata. Credo che tu possa trovarla."],
      flavor: [
        "Non proprio. Guarda ancora.",
        "Quasi. Riprova.",
        "Un'altra occhiata dovrebbe bastare.",
      ],
    },
    close: {
      plain: ["Vicino, ma non la migliore"],
      flavor: [
        "Quasi. Ce n'è una migliore",
        "Buona, ma non la migliore",
        "Vicino. Un'opzione va meglio",
      ],
    },
    answer: {
      plain: ["Ecco la risposta"],
      flavor: [
        "Ecco come funziona",
        "Vediamo la risposta",
        "Questa era difficile. Eccola",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Aah! È giusta. È davvero giusta"],
      flavor: [
        "Oh mamma, oh mamma, ce l'hai fatta",
        "Non ci credo che abbia funzionato",
        "Uff. Pensavo fosse la fine",
        "È giusta. Niente panico",
        "Ho smesso di tremare. È giusta",
        "Ce l'hai fatta e non è esploso niente",
        "Giusta. Il mio cuore non regge",
      ],
    },
    correctWithHint: {
      plain: ["Il suggerimento ci ha salvato"],
      flavor: [
        "Uff, suggerimento e fatto. Tremo",
        "Serviva aiuto, e va bene così",
        "Il suggerimento ha funzionato. Davvero",
      ],
    },
    goodGuess: {
      plain: ["Aah! Come facevi a saperlo?"],
      flavor: [
        "Aspetta, lo sapevi e basta?",
        "Quell'intuizione era troppo giusta",
        "Come? Mi stai spiando?",
      ],
    },
    hookMiss: {
      plain: ["Aah! Va bene. Va benissimo"],
      flavor: [
        "Sbagliato, ma è solo un tentativo. Respira",
        "Nessuno ha visto niente. Avanti",
        "Non preoccuparti, mi preoccupo io per te",
      ],
    },
    nudge: {
      plain: ["Aah! Non quella. Guarda ancora"],
      flavor: [
        "Oh no, oh no. Un'altra occhiata?",
        "Ok, respiro profondo. Guarda ancora",
        "Non è quella, ma si può ancora sistemare",
      ],
    },
    close: {
      plain: ["Così vicino. Perché sempre così vicino?"],
      flavor: [
        "Quasi. È quasi peggio",
        "Ce n'è una migliore, lo giuro",
        "Vicino. I miei nervi non reggono",
      ],
    },
    answer: {
      plain: ["Ok, ok, niente panico. Eccola"],
      flavor: [
        "Eccola. Non ne parliamo mai più",
        "Presto, prima che sparisca",
        "Uff. Ok. Ecco come funziona",
      ],
    },
  },
}
