import type { Voices } from "../../voices"

export const it: Voices = {
  default: {
    praise: [
      "Ecco",
      "Ottimo lavoro",
      "Esatto",
      "Ci sei",
      "Perfetto",
      "Proprio quella",
      "Ben visto",
      "Giusto così",
    ],
    correctWithHint: [
      "Corretto, con un suggerimento",
      "Con un suggerimento, ma ci sei",
      "Suggerimento usato, risposta trovata",
      "Ben ragionato",
    ],
    goodGuess: [
      "Bella intuizione!",
      "Buon istinto",
      "Ben pensato",
      "Ottimo intuito",
    ],
    hookMiss: [
      "Non proprio, e va bene così",
      "Non stavolta, e va bene così",
      "Bel tentativo. Vediamo perché",
      "Non proprio. Presto vedrai perché",
    ],
    nudge: [
      "Dai un'altra occhiata. Credo che tu possa trovarla.",
      "Non proprio. Guarda ancora.",
      "Quasi. Riprova.",
      "Un'altra occhiata dovrebbe bastare.",
    ],
    close: [
      "Vicino, ma non la migliore",
      "Quasi. Ce n'è una migliore",
      "Buona, ma non la migliore",
      "Vicino. Un'opzione va meglio",
    ],
    answer: [
      "Ecco la risposta",
      "Ecco come funziona",
      "Vediamo la risposta",
      "Questa era difficile. Eccola",
    ],
  },
  unhinged: {
    praise: [
      "Aah! È giusta. È davvero giusta",
      "Oh mamma, oh mamma, ce l'hai fatta",
      "Non ci credo che abbia funzionato",
      "Uff. Pensavo fosse la fine",
      "È giusta. Niente panico",
      "Ho smesso di tremare. È giusta",
      "Ce l'hai fatta e non è esploso niente",
      "Giusta. Il mio cuore non regge",
    ],
    correctWithHint: [
      "Il suggerimento ci ha salvato",
      "Uff, suggerimento e fatto. Tremo",
      "Serviva aiuto, e va bene così",
      "Il suggerimento ha funzionato. Davvero",
    ],
    goodGuess: [
      "Aah! Come facevi a saperlo?",
      "Aspetta, lo sapevi e basta?",
      "Quell'intuizione era troppo giusta",
      "Come? Mi stai spiando?",
    ],
    hookMiss: [
      "Aah! Va bene. Va benissimo",
      "Sbagliato, ma è solo un tentativo. Respira",
      "Nessuno ha visto niente. Avanti",
      "Non preoccuparti, mi preoccupo io per te",
    ],
    nudge: [
      "Aah! Non quella. Guarda ancora",
      "Oh no, oh no. Un'altra occhiata?",
      "Ok, respiro profondo. Guarda ancora",
      "Non è quella, ma si può ancora sistemare",
    ],
    close: [
      "Così vicino. Perché sempre così vicino?",
      "Quasi. È quasi peggio",
      "Ce n'è una migliore, lo giuro",
      "Vicino. I miei nervi non reggono",
    ],
    answer: [
      "Ok, ok, niente panico. Eccola",
      "Eccola. Non ne parliamo mai più",
      "Presto, prima che sparisca",
      "Uff. Ok. Ecco come funziona",
    ],
  },
}
