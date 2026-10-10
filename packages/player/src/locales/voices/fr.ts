import type { Voices } from "../../voices"

export const fr: Voices = {
  default: {
    praise: [
      "Voilà",
      "Bien joué",
      "Exactement",
      "C'est ça",
      "Dans le mille",
      "C'est la bonne",
      "Bien vu",
      "Parfait",
    ],
    correctWithHint: [
      "Correct, avec un indice",
      "Trouvé avec un indice",
      "Indice utilisé, réponse trouvée",
      "Joliment résolu",
    ],
    goodGuess: ["Bien deviné !", "Bonne intuition", "Bon choix", "Bien flairé"],
    hookMiss: [
      "Pas tout à fait, et ce n'est pas grave",
      "Pas cette fois, et ce n'est pas grave",
      "Bien tenté. Voyons pourquoi",
      "Pas tout à fait. Tu vas vite comprendre",
    ],
    nudge: [
      "Regarde encore une fois. Je pense que tu vas trouver.",
      "Pas tout à fait. Regarde encore.",
      "Presque. Essaie encore une fois.",
      "Encore un coup d'œil et c'est bon.",
    ],
    close: [
      "Pas loin, mais pas la meilleure",
      "Presque. Il y a mieux",
      "Bien, mais pas la meilleure",
      "Pas loin. Une autre convient mieux",
    ],
    answer: [
      "Voici la réponse",
      "Voici comment ça marche",
      "Regardons la réponse",
      "Celle-ci était dure. La voici",
    ],
  },
  unhinged: {
    praise: [
      "Aah ! C'est juste. C'est vraiment juste",
      "Oh là là, tu as réussi",
      "Je n'arrive pas à croire que ça a marché",
      "Ouf. J'ai cru qu'on était fichus",
      "C'est juste. Pas de panique",
      "Mon œil ne tressaute plus. Correct",
      "Tu as réussi et rien n'a explosé",
      "Correct. Mon cœur ne tiendra pas",
    ],
    correctWithHint: [
      "L'indice nous a sauvés tous les deux",
      "Ouf, indice et c'est fait. Je tremble",
      "On avait besoin d'aide, et c'est OK",
      "L'indice a marché. Il a vraiment marché",
    ],
    goodGuess: [
      "Aah ! Comment tu savais ?",
      "Attends, tu le savais, comme ça ?",
      "Cette intuition était trop juste",
      "Comment ? Tu me surveilles ?",
    ],
    hookMiss: [
      "Aah ! Ça va. Tout va bien",
      "Faux, mais ce n'était qu'un essai. Respire",
      "Personne n'a rien vu. On continue",
      "T'inquiète, je m'inquiète pour toi",
    ],
    nudge: [
      "Aah ! Pas celle-là. Regarde encore",
      "Oh non, oh non. Encore un coup d'œil ?",
      "OK, on respire. Regarde encore",
      "Pas ça, mais tu peux encore te rattraper",
    ],
    close: [
      "Si près. Pourquoi toujours si près ?",
      "Presque. C'est presque pire",
      "Il y a mieux, je te jure",
      "Pas loin. Mes nerfs ne supportent pas",
    ],
    answer: [
      "OK, OK, pas de panique. La voici",
      "La voici. On n'en parle plus jamais",
      "Vite, avant qu'elle disparaisse",
      "Ouf. Bon. Voici comment ça marche",
    ],
  },
}
