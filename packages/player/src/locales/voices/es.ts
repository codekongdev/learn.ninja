import type { PartialVoices } from "../../voices"

// es: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const es: PartialVoices = {
  default: {
    praise: {
      plain: ["Eso es"],
      flavor: [
        "Buen trabajo",
        "Exacto",
        "Lo tienes",
        "Perfecto",
        "Esa es",
        "Bien visto",
        "Muy bien",
      ],
    },
    correctWithHint: {
      plain: ["Correcto, con una pista"],
      flavor: [
        "Lo lograste con una pista",
        "Pista usada, respuesta encontrada",
        "Bien resuelto",
      ],
    },
    goodGuess: {
      plain: ["¡Buena intuición!"],
      flavor: ["Buen instinto", "Bien pensado", "Buen ojo"],
    },
    hookMiss: {
      plain: ["No del todo, y no pasa nada"],
      flavor: [
        "Esta vez no, y no pasa nada",
        "Buen intento. Veamos por qué",
        "No del todo. Pronto verás por qué",
      ],
    },
    nudge: {
      plain: ["Míralo otra vez. Seguro que lo encuentras."],
      flavor: [
        "No del todo. Vuelve a mirarlo.",
        "Casi. Inténtalo otra vez.",
        "Un vistazo más y lo tienes.",
      ],
    },
    close: {
      plain: ["Cerca, pero no es la mejor"],
      flavor: [
        "Casi. Hay una mejor",
        "Bien, pero no es la mejor",
        "Cerca. Otra opción encaja mejor",
      ],
    },
    answer: {
      plain: ["Esta es la respuesta"],
      flavor: [
        "Así es como funciona",
        "Veamos la respuesta",
        "Esta era difícil. Aquí está",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["¡Ay! Es correcto. De verdad es correcto"],
      flavor: [
        "Ay, ay, ay, lo lograste",
        "No puedo creer que funcionara",
        "Uf. Creí que estábamos perdidos",
        "Es correcto. Que nadie entre en pánico",
        "Ya no me tiembla el ojo. Correcto",
        "Lo lograste y nada explotó",
        "Correcto. Mi corazón no aguanta esto",
      ],
    },
    correctWithHint: {
      plain: ["La pista nos salvó a los dos"],
      flavor: [
        "Uf, pista y listo. Estoy temblando",
        "Necesitábamos ayuda y no pasa nada",
        "La pista funcionó. Funcionó de verdad",
      ],
    },
    goodGuess: {
      plain: ["¡Ay! ¿Cómo lo sabías?"],
      flavor: [
        "Espera, ¿simplemente lo sabías?",
        "Esa intuición fue demasiado buena",
        "¿Cómo? ¿Me estás vigilando?",
      ],
    },
    hookMiss: {
      plain: ["¡Ay! Está bien. Todo está bien"],
      flavor: [
        "Mal, pero solo era una intuición. Respira",
        "Nadie vio eso. Sigamos",
        "No te preocupes, yo me preocupo por ti",
      ],
    },
    nudge: {
      plain: ["¡Ay! Esa no. Mira otra vez"],
      flavor: [
        "Ay, no, ay, no. ¿Otra mirada?",
        "Bien, respira hondo. Mira otra vez",
        "No es, pero aún puedes arreglarlo",
      ],
    },
    close: {
      plain: ["Tan cerca. ¿Por qué siempre tan cerca?"],
      flavor: [
        "Casi. Eso es casi peor",
        "Hay una mejor, te lo juro",
        "Cerca. Mis nervios no aguantan tanto",
      ],
    },
    answer: {
      plain: ["A ver, a ver, sin pánico. Aquí está"],
      flavor: [
        "Aquí está. No volvamos a hablar de esto",
        "Rápido, antes de que desaparezca",
        "Uf. Bien. Así es como funciona",
      ],
    },
  },
}
