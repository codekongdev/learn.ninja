import type { PartialVoices } from "../../voices"

// fr: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const fr: PartialVoices = {
  default: {
    praise: {
      plain: ["Voilà"],
      flavor: [
        "Bien joué",
        "Exactement",
        "C'est ça",
        "Dans le mille",
        "C'est la bonne",
        "Bien vu",
        "Parfait",
      ],
    },
    correctWithHint: {
      plain: ["Correct, avec un indice"],
      flavor: [
        "Trouvé avec un indice",
        "Indice utilisé, réponse trouvée",
        "Joliment résolu",
      ],
    },
    goodGuess: {
      plain: ["Bien deviné !"],
      flavor: ["Bonne intuition", "Bon choix", "Bien flairé"],
    },
    hookMiss: {
      plain: ["Pas tout à fait, et ce n'est pas grave"],
      flavor: [
        "Pas cette fois, et ce n'est pas grave",
        "Bien tenté. Voyons pourquoi",
        "Pas tout à fait. Tu vas vite comprendre",
      ],
    },
    nudge: {
      plain: ["Regarde encore une fois. Je pense que tu vas trouver."],
      flavor: [
        "Pas tout à fait. Regarde encore.",
        "Presque. Essaie encore une fois.",
        "Encore un coup d'œil et c'est bon.",
      ],
    },
    close: {
      plain: ["Pas loin, mais pas la meilleure"],
      flavor: [
        "Presque. Il y a mieux",
        "Bien, mais pas la meilleure",
        "Pas loin. Une autre convient mieux",
      ],
    },
    answer: {
      plain: ["Voici la réponse"],
      flavor: [
        "Voici comment ça marche",
        "Regardons la réponse",
        "Celle-ci était dure. La voici",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Aah ! C'est juste. C'est vraiment juste"],
      flavor: [
        "Oh là là, tu as réussi",
        "Je n'arrive pas à croire que ça a marché",
        "Ouf. J'ai cru qu'on était fichus",
        "C'est juste. Pas de panique",
        "Mon œil ne tressaute plus. Correct",
        "Tu as réussi et rien n'a explosé",
        "Correct. Mon cœur ne tiendra pas",
      ],
    },
    correctWithHint: {
      plain: ["L'indice nous a sauvés tous les deux"],
      flavor: [
        "Ouf, indice et c'est fait. Je tremble",
        "On avait besoin d'aide, et c'est OK",
        "L'indice a marché. Il a vraiment marché",
      ],
    },
    goodGuess: {
      plain: ["Aah ! Comment tu savais ?"],
      flavor: [
        "Attends, tu le savais, comme ça ?",
        "Cette intuition était trop juste",
        "Comment ? Tu me surveilles ?",
      ],
    },
    hookMiss: {
      plain: ["Aah ! Ça va. Tout va bien"],
      flavor: [
        "Faux, mais ce n'était qu'un essai. Respire",
        "Personne n'a rien vu. On continue",
        "T'inquiète, je m'inquiète pour toi",
      ],
    },
    nudge: {
      plain: ["Aah ! Pas celle-là. Regarde encore"],
      flavor: [
        "Oh non, oh non. Encore un coup d'œil ?",
        "OK, on respire. Regarde encore",
        "Pas ça, mais tu peux encore te rattraper",
      ],
    },
    close: {
      plain: ["Si près. Pourquoi toujours si près ?"],
      flavor: [
        "Presque. C'est presque pire",
        "Il y a mieux, je te jure",
        "Pas loin. Mes nerfs ne supportent pas",
      ],
    },
    answer: {
      plain: ["OK, OK, pas de panique. La voici"],
      flavor: [
        "La voici. On n'en parle plus jamais",
        "Vite, avant qu'elle disparaisse",
        "Ouf. Bon. Voici comment ça marche",
      ],
    },
  },
}
