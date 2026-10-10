import type { Voices } from "../../voices"

// Português do Brasil, sem regionalismos marcados. Default é curto e claro, Sensei é um mestre sereno e
// Unhinged é um pilha de nervos que fala como a gente fala, não como tradução.

export const pt: Voices = {
  default: {
    praise: {
      plain: ["Correto.", "Isso mesmo."],
      flavor: [
        "Bom trabalho!",
        "Exato.",
        "Você acertou.",
        "Na mosca.",
        "Bem observado.",
        "É isso.",
        "Essa mesmo.",
        "Muito bem.",
      ],
    },
    correctWithHint: {
      plain: ["Correto, com uma dica."],
      flavor: [
        "A dica fez o trabalho dela.",
        "Bem resolvido.",
        "Com dica, mas chegou lá.",
      ],
    },
    goodGuess: {
      plain: ["Bom palpite!"],
      flavor: ["Bom instinto.", "Boa escolha.", "Palpite certeiro."],
    },
    hookMiss: {
      plain: ["Não foi dessa vez, e tudo bem."],
      flavor: [
        "Boa tentativa. Vamos ver por quê.",
        "Quase. Logo você vai ver por quê.",
      ],
    },
    nudge: {
      plain: ["Não é isso. Olhe de novo."],
      flavor: [
        "Quase. Tente mais uma vez.",
        "Mais uma olhada e você acerta.",
        "Dê mais uma olhada. Acho que você pega.",
      ],
    },
    close: {
      plain: ["Perto, mas não é a melhor."],
      flavor: [
        "Quase. Outra opção encaixa melhor.",
        "Boa, mas não é a melhor.",
      ],
    },
    answer: {
      plain: ["Aqui está a resposta."],
      flavor: [
        "É assim que funciona.",
        "Essa era difícil. Aqui está.",
        "Vamos ver a resposta.",
      ],
    },
    streak: {
      plain: ["Três seguidas."],
      flavor: ["Você está embalado.", "Isso é uma sequência."],
    },
    comeback: {
      plain: ["Aí está."],
      flavor: ["Dessa vez foi.", "Boa recuperação."],
    },
    last: {
      plain: ["A última, e certa."],
      flavor: ["Essa era a lição.", "Terminou forte."],
    },
    perfect: {
      plain: ["Todas certas."],
      flavor: ["Sem um erro.", "Nada para corrigir."],
    },
  },
  sensei: {
    praise: {
      plain: ["Bom. É isso.", "Sim."],
      flavor: [
        "Você viu.",
        "Bem visto.",
        "Exatamente assim.",
        "Seu olhar está ficando mais afiado.",
        "Sim. Feito em silêncio.",
        "Esse é o caminho.",
        "Bom. Guarde isso.",
      ],
    },
    correctWithHint: {
      plain: ["Correto. A dica mostrou o caminho, você o percorreu."],
      flavor: [
        "Pedir ajuda também é uma habilidade.",
        "Ajuda recebida, lição guardada.",
        "Uma dica é uma mão, não uma muleta.",
      ],
    },
    goodGuess: {
      plain: ["Um bom palpite."],
      flavor: [
        "Seu instinto sabe coisas que você ainda não sabe.",
        "Confie no pressentimento, depois teste.",
        "Bem intuído. Agora vamos ver por quê.",
      ],
    },
    hookMiss: {
      plain: ["Ainda não, e é esse o ponto."],
      flavor: [
        "Um palpite nos mostra por onde começar.",
        "Não importa. A lição começa aqui.",
      ],
    },
    nudge: {
      plain: ["Ainda não. Olhe mais uma vez."],
      flavor: [
        "Devagar. Está aí.",
        "Respire, depois olhe de novo.",
        "A resposta não saiu do lugar.",
      ],
    },
    close: {
      plain: ["Perto. Uma encaixa melhor."],
      flavor: [
        "Bom olho. Agora ache a melhor.",
        "Quase. Procure a mais precisa.",
      ],
    },
    answer: {
      plain: ["Aqui está a resposta."],
      flavor: [
        "Fique um momento com esta.",
        "As difíceis ensinam mais. Aqui está.",
        "Aqui está a resposta. Leia devagar.",
      ],
    },
    streak: {
      plain: ["Três seguidas. Com calma."],
      flavor: ["Você achou seu ritmo.", "Mãos calmas, olhos claros."],
    },
    comeback: {
      plain: ["Você olhou de novo, e lá estava."],
      flavor: ["É assim que se aprende.", "O segundo olhar é a lição."],
    },
    last: {
      plain: ["E essa é a lição. Bem percorrida."],
      flavor: [
        "O último passo ainda é um passo.",
        "Você terminou o que começou.",
      ],
    },
    perfect: {
      plain: ["Nem um tropeço. Leve isso com você."],
      flavor: [
        "Uma mente calma enxerga claro.",
        "Nada a corrigir. Só a lembrar.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Correto. Respira.", "Está certo. Ninguém entra em pânico."],
      flavor: [
        "Eita! Está certo. Está certo mesmo!",
        "Meu Deus, você conseguiu!",
        "Não acredito que deu certo.",
        "Ufa. Achei que a gente estava perdido.",
        "Meu olho parou de tremer. Correto.",
        "Você acertou e nada explodiu!",
        "Correto. Meu coração não aguenta isso.",
      ],
    },
    correctWithHint: {
      plain: ["Dica. Correto. Respira."],
      flavor: [
        "A dica salvou nós dois.",
        "Ufa, dica e pronto. Estou tremendo.",
        "A dica funcionou. Funcionou mesmo!",
      ],
    },
    goodGuess: {
      plain: ["Espera, você simplesmente sabia?"],
      flavor: [
        "Eita! Como você sabia?",
        "Esse palpite foi certo demais.",
        "Como? Você está me espionando?",
      ],
    },
    hookMiss: {
      plain: ["Tudo bem. Está tudo bem mesmo."],
      flavor: [
        "Errou, mas era só um palpite. Respira.",
        "Ninguém viu. Seguindo.",
        "Relaxa, eu me preocupo por você.",
      ],
    },
    nudge: {
      plain: ["Essa não. Olha de novo."],
      flavor: [
        "Ai, não, ai, não. Mais uma olhada?",
        "Tá, respira fundo. Olha de novo.",
        "Não é essa, mas ainda dá para consertar.",
      ],
    },
    close: {
      plain: ["Tão perto. Por que é sempre tão perto?"],
      flavor: [
        "Quase. Isso é quase pior.",
        "Tem uma melhor, eu juro.",
        "Perto. Meus nervos não aguentam perto.",
      ],
    },
    answer: {
      plain: ["Tá, sem pânico. Aqui está."],
      flavor: [
        "Aqui está. Nunca mais falamos disso.",
        "Rápido, antes que suma!",
        "Ufa. Tá. É assim que funciona.",
      ],
    },
    streak: {
      plain: ["Três seguidas? Quem É você?"],
      flavor: [
        "Para, para, eu não aguento uma sequência!",
        "Três! Preciso me sentar.",
      ],
    },
    comeback: {
      plain: ["Você voltou. Daquilo."],
      flavor: [
        "Resolvido. Nunca mais duvido de você. Até a próxima.",
        "Ufa. Achei que aquela tinha nos pegado.",
      ],
    },
    last: {
      plain: ["Acabou. A gente conseguiu."],
      flavor: ["Preciso me deitar.", "A última. Minhas pernas bambearam."],
    },
    perfect: {
      plain: ["Perfeito. PERFEITO. Preciso me sentar."],
      flavor: ["Nada explodiu. Nenhuma vez.", "Todas? Vou desmaiar."],
    },
  },
}
