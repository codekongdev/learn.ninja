import type { Voices } from "../../voices"

// Italiano (tu). Default è breve e chiaro, Sensei è un maestro pacato, e Unhinged è un fascio di nervi
// che parla come si parla, non come si traduce.

export const it: Voices = {
  default: {
    praise: {
      plain: ["Corretto.", "Proprio così."],
      flavor: [
        "Ottimo lavoro!",
        "Esatto.",
        "Ci sei.",
        "Centro.",
        "Ben visto.",
        "Ecco.",
        "È quella.",
        "Molto bene.",
      ],
    },
    correctWithHint: {
      plain: ["Corretto, con un suggerimento."],
      flavor: [
        "Il suggerimento ha fatto il suo.",
        "Ben ragionato.",
        "Con un aiuto, ma ci sei arrivato.",
      ],
    },
    goodGuess: {
      plain: ["Bella intuizione!"],
      flavor: ["Buon istinto.", "Buona scelta.", "Intuizione precisa."],
    },
    hookMiss: {
      plain: ["Non proprio, e va bene così."],
      flavor: [
        "Buon tentativo. Vediamo perché.",
        "Non proprio. Vedrai presto perché.",
      ],
    },
    nudge: {
      plain: ["Non proprio. Guarda di nuovo."],
      flavor: [
        "Quasi. Riprova.",
        "Ancora un'occhiata e ci sei.",
        "Dagli un'altra occhiata. Credo che tu possa trovarlo.",
      ],
    },
    close: {
      plain: ["Vicino, ma non la migliore."],
      flavor: [
        "Quasi. Un'altra opzione calza meglio.",
        "Buona, ma non la migliore.",
      ],
    },
    answer: {
      plain: ["Ecco la risposta."],
      flavor: [
        "Ecco come funziona.",
        "Questa era difficile. Eccola.",
        "Guardiamo la risposta.",
      ],
    },
    streak: {
      plain: ["Tre di fila."],
      flavor: ["Sei in serie.", "Questa è una striscia."],
    },
    comeback: {
      plain: ["Eccola."],
      flavor: ["Stavolta sì.", "Bel recupero."],
    },
    last: {
      plain: ["L'ultima, ed è giusta."],
      flavor: ["Questa era la lezione.", "Hai chiuso alla grande."],
    },
    perfect: {
      plain: ["Tutte giuste."],
      flavor: ["Senza un errore.", "Niente da correggere."],
    },
  },
  sensei: {
    praise: {
      plain: ["Bene. È così.", "Sì."],
      flavor: [
        "L'hai visto.",
        "Ben osservato.",
        "Proprio così.",
        "Il tuo occhio si affina.",
        "Sì. Senza rumore.",
        "Questa è la via.",
        "Bene. Tienilo.",
      ],
    },
    correctWithHint: {
      plain: [
        "Corretto. Il suggerimento ha mostrato la via, tu l'hai percorsa.",
      ],
      flavor: [
        "Anche chiedere è un'abilità.",
        "Aiuto preso, lezione tenuta.",
        "Un suggerimento è una mano, non una stampella.",
      ],
    },
    goodGuess: {
      plain: ["Una buona intuizione."],
      flavor: [
        "Il tuo istinto sa cose che tu ancora non sai.",
        "Fidati della sensazione, poi mettila alla prova.",
        "Ben intuito. Ora vediamo perché.",
      ],
    },
    hookMiss: {
      plain: ["Non ancora, ed è questo il punto."],
      flavor: [
        "Un'ipotesi ci dice da dove partire.",
        "Non importa. La lezione comincia qui.",
      ],
    },
    nudge: {
      plain: ["Non ancora. Guarda ancora una volta."],
      flavor: [
        "Piano. È lì.",
        "Respira, poi guarda di nuovo.",
        "La risposta non si è mossa.",
      ],
    },
    close: {
      plain: ["Vicino. Una calza meglio."],
      flavor: [
        "Buon occhio. Ora trova la migliore.",
        "Quasi. Cerca quella più precisa.",
      ],
    },
    answer: {
      plain: ["Ecco la risposta."],
      flavor: [
        "Fermati un momento su questa.",
        "Le difficili insegnano di più. Eccola.",
        "Ecco la risposta. Leggila con calma.",
      ],
    },
    streak: {
      plain: ["Tre di fila. Con calma."],
      flavor: ["Hai trovato il tuo ritmo.", "Mani ferme, occhi chiari."],
    },
    comeback: {
      plain: ["Hai guardato di nuovo, ed era lì."],
      flavor: ["Così si impara.", "Il secondo sguardo è la lezione."],
    },
    last: {
      plain: ["Ed ecco la lezione. Ben percorsa."],
      flavor: [
        "L'ultimo passo è pur sempre un passo.",
        "Hai finito ciò che avevi iniziato.",
      ],
    },
    perfect: {
      plain: ["Nemmeno un inciampo. Portalo con te."],
      flavor: [
        "Una mente calma vede chiaro.",
        "Niente da correggere. Solo da ricordare.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Corretto. Respira.", "È giusta. Nessuno si agiti."],
      flavor: [
        "Ahh! È giusta. È giusta davvero!",
        "Mamma mia, ce l'hai fatta!",
        "Non ci credo che ha funzionato.",
        "Uff. Pensavo fossimo spacciati.",
        "L'occhio ha smesso di tremare. Corretto.",
        "Ce l'hai fatta e non è esploso niente!",
        "Corretto. Il mio cuore non regge.",
      ],
    },
    correctWithHint: {
      plain: ["Suggerimento. Corretto. Respira."],
      flavor: [
        "Il suggerimento ci ha salvati entrambi.",
        "Uff, suggerimento e via. Sto tremando.",
        "Il suggerimento ha funzionato. Ha funzionato davvero!",
      ],
    },
    goodGuess: {
      plain: ["Aspetta, lo sapevi e basta?"],
      flavor: [
        "Ahh! Come facevi a saperlo?",
        "Quell'intuizione era troppo giusta.",
        "Come? Mi stai spiando?",
      ],
    },
    hookMiss: {
      plain: ["Va bene. Va benissimo, davvero."],
      flavor: [
        "Sbagliato, ma era solo un'ipotesi. Respira.",
        "Nessuno ha visto. Andiamo avanti.",
        "Tranquillo, mi preoccupo io per te.",
      ],
    },
    nudge: {
      plain: ["Non quella. Guarda di nuovo."],
      flavor: [
        "Oh no, oh no. Un'altra occhiata?",
        "Ok, respiro profondo. Guarda di nuovo.",
        "Non è quella, ma puoi ancora rimediare.",
      ],
    },
    close: {
      plain: ["Così vicino. Perché è sempre così vicino?"],
      flavor: [
        "Quasi. È quasi peggio.",
        "Ce n'è una migliore, lo giuro.",
        "Vicino. I miei nervi non reggono il vicino.",
      ],
    },
    answer: {
      plain: ["Ok, niente panico. Eccola."],
      flavor: [
        "Eccola. Non parliamone mai più.",
        "Presto, prima che sparisca!",
        "Uff. Ok. Ecco come funziona.",
      ],
    },
    streak: {
      plain: ["Tre di fila? Ma chi SEI?"],
      flavor: ["Basta, basta, non reggo una serie!", "Tre! Devo sedermi."],
    },
    comeback: {
      plain: ["Sei tornato. Da QUELLO."],
      flavor: [
        "Sistemato. Non dubiterò mai più di te. Fino alla prossima.",
        "Uff. Pensavo che quella ci avesse fregati.",
      ],
    },
    last: {
      plain: ["È finita. Ce l'abbiamo fatta."],
      flavor: ["Devo sdraiarmi.", "L'ultima. Le ginocchia hanno ceduto."],
    },
    perfect: {
      plain: ["Perfetto. PERFETTO. Devo sedermi."],
      flavor: [
        "Non è esploso niente. Nemmeno una volta.",
        "Tutte? Sto per svenire.",
      ],
    },
  },
}
