import type { Voices } from "../../voices"

export const es: Voices = {
  default: {
    praise: [
      "Eso es",
      "Buen trabajo",
      "Exacto",
      "Lo tienes",
      "Perfecto",
      "Esa es",
      "Bien visto",
      "Muy bien",
    ],
    correctWithHint: [
      "Correcto, con una pista",
      "Lo lograste con una pista",
      "Pista usada, respuesta encontrada",
      "Bien resuelto",
    ],
    goodGuess: [
      "¡Buena intuición!",
      "Buen instinto",
      "Bien pensado",
      "Buen ojo",
    ],
    hookMiss: [
      "No del todo, y no pasa nada",
      "Esta vez no, y no pasa nada",
      "Buen intento. Veamos por qué",
      "No del todo. Pronto verás por qué",
    ],
    nudge: [
      "Míralo otra vez. Seguro que lo encuentras.",
      "No del todo. Vuelve a mirarlo.",
      "Casi. Inténtalo otra vez.",
      "Un vistazo más y lo tienes.",
    ],
    close: [
      "Cerca, pero no es la mejor",
      "Casi. Hay una mejor",
      "Bien, pero no es la mejor",
      "Cerca. Otra opción encaja mejor",
    ],
    answer: [
      "Esta es la respuesta",
      "Así es como funciona",
      "Veamos la respuesta",
      "Esta era difícil. Aquí está",
    ],
  },
  unhinged: {
    praise: [
      "¡Ay! Es correcto. De verdad es correcto",
      "Ay, ay, ay, lo lograste",
      "No puedo creer que funcionara",
      "Uf. Creí que estábamos perdidos",
      "Es correcto. Que nadie entre en pánico",
      "Ya no me tiembla el ojo. Correcto",
      "Lo lograste y nada explotó",
      "Correcto. Mi corazón no aguanta esto",
    ],
    correctWithHint: [
      "La pista nos salvó a los dos",
      "Uf, pista y listo. Estoy temblando",
      "Necesitábamos ayuda y no pasa nada",
      "La pista funcionó. Funcionó de verdad",
    ],
    goodGuess: [
      "¡Ay! ¿Cómo lo sabías?",
      "Espera, ¿simplemente lo sabías?",
      "Esa intuición fue demasiado buena",
      "¿Cómo? ¿Me estás vigilando?",
    ],
    hookMiss: [
      "¡Ay! Está bien. Todo está bien",
      "Mal, pero solo era una intuición. Respira",
      "Nadie vio eso. Sigamos",
      "No te preocupes, yo me preocupo por ti",
    ],
    nudge: [
      "¡Ay! Esa no. Mira otra vez",
      "Ay, no, ay, no. ¿Otra mirada?",
      "Bien, respira hondo. Mira otra vez",
      "No es, pero aún puedes arreglarlo",
    ],
    close: [
      "Tan cerca. ¿Por qué siempre tan cerca?",
      "Casi. Eso es casi peor",
      "Hay una mejor, te lo juro",
      "Cerca. Mis nervios no aguantan tanto",
    ],
    answer: [
      "A ver, a ver, sin pánico. Aquí está",
      "Aquí está. No volvamos a hablar de esto",
      "Rápido, antes de que desaparezca",
      "Uf. Bien. Así es como funciona",
    ],
  },
}
