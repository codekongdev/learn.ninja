import type { PartialVoices } from "../../voices"

// pt: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const pt: PartialVoices = {
  default: {
    praise: {
      plain: ["É isso aí"],
      flavor: [
        "Bom trabalho",
        "Exatamente",
        "Acertou",
        "Na mosca",
        "É essa",
        "Bem observado",
        "Mandou bem",
      ],
    },
    correctWithHint: {
      plain: ["Correto, com uma dica"],
      flavor: [
        "Chegou lá com uma dica",
        "Dica usada, resposta encontrada",
        "Muito bem resolvido",
      ],
    },
    goodGuess: {
      plain: ["Bom palpite!"],
      flavor: ["Boa intuição", "Boa escolha", "Palpite certeiro"],
    },
    hookMiss: {
      plain: ["Não é bem isso, e tudo bem"],
      flavor: [
        "Não foi dessa vez, e tudo bem",
        "Boa tentativa. Vamos ver por quê",
        "Não é bem isso. Você já vai ver por quê",
      ],
    },
    nudge: {
      plain: ["Dê mais uma olhada. Acho que você consegue."],
      flavor: [
        "Não é bem isso. Olhe de novo.",
        "Quase. Tente mais uma vez.",
        "Mais uma olhada deve resolver.",
      ],
    },
    close: {
      plain: ["Quase, mas não é a melhor"],
      flavor: [
        "Quase. Tem uma melhor",
        "Boa, mas não é a melhor",
        "Perto. Outra opção se encaixa melhor",
      ],
    },
    answer: {
      plain: ["Esta é a resposta"],
      flavor: [
        "Veja como funciona",
        "Vamos ver a resposta",
        "Essa era difícil. Aqui está",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Ai! Está certo. Está certo mesmo"],
      flavor: [
        "Ai, ai, ai, você conseguiu",
        "Não acredito que funcionou",
        "Ufa. Achei que estávamos perdidos",
        "Está certo. Ninguém entre em pânico",
        "Meu olho parou de tremer. Correto",
        "Você acertou e nada explodiu",
        "Correto. Meu coração não aguenta",
      ],
    },
    correctWithHint: {
      plain: ["A dica salvou nós dois"],
      flavor: [
        "Ufa, dica e pronto. Estou tremendo",
        "Precisamos de ajuda, e tudo bem",
        "A dica funcionou. Funcionou mesmo",
      ],
    },
    goodGuess: {
      plain: ["Ai! Como você sabia?"],
      flavor: [
        "Espera, você simplesmente sabia?",
        "Esse palpite foi certo demais",
        "Como? Você está me vigiando?",
      ],
    },
    hookMiss: {
      plain: ["Ai! Tudo bem. Está tudo bem"],
      flavor: [
        "Errado, mas era só um palpite. Respira",
        "Ninguém viu isso. Próxima",
        "Relaxa, eu me preocupo por você",
      ],
    },
    nudge: {
      plain: ["Ai! Essa não. Olha de novo"],
      flavor: [
        "Ai, não, ai, não. Mais uma olhada?",
        "Tá, respira fundo. Olha de novo",
        "Não é, mas ainda dá pra consertar",
      ],
    },
    close: {
      plain: ["Tão perto. Por que é sempre tão perto?"],
      flavor: [
        "Quase. Isso é quase pior",
        "Tem uma melhor, eu juro",
        "Perto. Meus nervos não aguentam",
      ],
    },
    answer: {
      plain: ["Tá, tá, sem pânico. Aqui está"],
      flavor: [
        "Aqui está. Nunca mais falamos disso",
        "Rápido, antes que desapareça",
        "Ufa. Tá. É assim que funciona",
      ],
    },
  },
}
