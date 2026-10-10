import type { Voices } from "../../voices"

// Español neutro (tú). Default es breve y claro, Sensei es un maestro sereno, y Unhinged es un manojo
// de nervios que habla como se habla, no como se traduce.

export const es: Voices = {
  default: {
    praise: {
      plain: ["Correcto.", "Así es."],
      flavor: [
        "¡Buen trabajo!",
        "Exacto.",
        "Lo tienes.",
        "Perfecto.",
        "Bien visto.",
        "Eso es.",
        "Esa es.",
        "Muy bien.",
      ],
    },
    correctWithHint: {
      plain: ["Correcto, con una pista."],
      flavor: [
        "La pista hizo su trabajo.",
        "Bien resuelto.",
        "Con pista, pero lo lograste.",
      ],
    },
    goodGuess: {
      plain: ["¡Buena intuición!"],
      flavor: ["Buen instinto.", "Buen ojo.", "Bien pensado."],
    },
    hookMiss: {
      plain: ["No del todo, y no pasa nada."],
      flavor: [
        "Buen intento. Veamos por qué.",
        "No del todo. Pronto verás por qué.",
      ],
    },
    nudge: {
      plain: ["No del todo. Míralo otra vez."],
      flavor: [
        "Casi. Inténtalo de nuevo.",
        "Un vistazo más y lo tienes.",
        "Míralo otra vez. Seguro que lo encuentras.",
      ],
    },
    close: {
      plain: ["Cerca, pero no es la mejor."],
      flavor: ["Casi. Otra opción encaja mejor.", "Bien, pero no es la mejor."],
    },
    answer: {
      plain: ["Esta es la respuesta."],
      flavor: [
        "Así es como funciona.",
        "Esta era difícil. Aquí está.",
        "Veamos la respuesta.",
      ],
    },
    streak: {
      plain: ["Tres seguidas."],
      flavor: ["Vas en racha.", "Eso es una racha."],
    },
    comeback: {
      plain: ["Ahí está."],
      flavor: ["Esta vez sí.", "Buena recuperación."],
    },
    last: {
      plain: ["La última, y correcta."],
      flavor: ["Esa era la lección.", "Terminaste fuerte."],
    },
    perfect: {
      plain: ["Todas correctas."],
      flavor: ["Sin un solo fallo.", "Nada que corregir."],
    },
  },
  sensei: {
    praise: {
      plain: ["Bien. Eso es.", "Sí."],
      flavor: [
        "Lo viste.",
        "Bien observado.",
        "Justo así.",
        "Tu ojo se afina.",
        "Sí. Sin ruido.",
        "Ese es el camino.",
        "Bien. Guarda eso.",
      ],
    },
    correctWithHint: {
      plain: ["Correcto. La pista mostró el camino, tú lo recorriste."],
      flavor: [
        "Pedir ayuda también es una habilidad.",
        "Ayuda recibida, lección guardada.",
        "Una pista es una mano, no una muleta.",
      ],
    },
    goodGuess: {
      plain: ["Una buena intuición."],
      flavor: [
        "Tu instinto sabe cosas que tú aún no.",
        "Confía en la corazonada, luego compruébala.",
        "Bien intuido. Ahora veamos por qué.",
      ],
    },
    hookMiss: {
      plain: ["Todavía no, y de eso se trata."],
      flavor: [
        "Una suposición nos dice por dónde empezar.",
        "No importa. La lección empieza aquí.",
      ],
    },
    nudge: {
      plain: ["Todavía no. Mira una vez más."],
      flavor: [
        "Despacio. Ahí está.",
        "Respira y vuelve a mirar.",
        "La respuesta no se ha movido.",
      ],
    },
    close: {
      plain: ["Cerca. Hay una que encaja mejor."],
      flavor: [
        "Buen ojo. Ahora busca la mejor.",
        "Casi. Busca la más precisa.",
      ],
    },
    answer: {
      plain: ["Aquí está la respuesta."],
      flavor: [
        "Quédate un momento con esta.",
        "Las difíciles enseñan más. Aquí está.",
        "Aquí está la respuesta. Léela despacio.",
      ],
    },
    streak: {
      plain: ["Tres seguidas. Con calma."],
      flavor: ["Encontraste tu ritmo.", "Manos tranquilas, ojos claros."],
    },
    comeback: {
      plain: ["Volviste a mirar, y ahí estaba."],
      flavor: ["Así se aprende.", "La segunda mirada es la lección."],
    },
    last: {
      plain: ["Y esa es la lección. Bien recorrida."],
      flavor: [
        "El último paso también es un paso.",
        "Terminaste lo que empezaste.",
      ],
    },
    perfect: {
      plain: ["Ni un tropiezo. Llévatelo contigo."],
      flavor: [
        "Una mente tranquila ve claro.",
        "Nada que corregir. Solo que recordar.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Correcto. Respira.", "Está bien. Que nadie entre en pánico."],
      flavor: [
        "¡Ay! Está bien. ¡Está bien de verdad!",
        "¡Madre mía, lo lograste!",
        "No me creo que haya funcionado.",
        "Uf. Pensé que estábamos perdidos.",
        "Se me pasó el tic del ojo. Correcto.",
        "¡Lo lograste y nada explotó!",
        "Correcto. Mi corazón no aguanta esto.",
      ],
    },
    correctWithHint: {
      plain: ["Pista. Correcto. Respira."],
      flavor: [
        "La pista nos salvó a los dos.",
        "Uf, pista y listo. Estoy temblando.",
        "La pista funcionó. ¡Funcionó de verdad!",
      ],
    },
    goodGuess: {
      plain: ["Espera, ¿lo sabías sin más?"],
      flavor: [
        "¡Ay! ¿Cómo lo supiste?",
        "Esa intuición fue demasiado buena.",
        "¿Cómo? ¿Me estás espiando?",
      ],
    },
    hookMiss: {
      plain: ["No pasa nada. De verdad que no pasa nada."],
      flavor: [
        "Mal, pero era solo una suposición. Respira.",
        "Nadie lo vio. Seguimos.",
        "Tranquilo, yo me preocupo por ti.",
      ],
    },
    nudge: {
      plain: ["Esa no. Mira otra vez."],
      flavor: [
        "Ay, no, ay, no. ¿Una mirada más?",
        "Bueno, respira hondo. Mira otra vez.",
        "No es esa, pero todavía lo puedes arreglar.",
      ],
    },
    close: {
      plain: ["Tan cerca. ¿Por qué siempre tan cerca?"],
      flavor: [
        "Casi. Eso es casi peor.",
        "Hay una mejor, te lo juro.",
        "Cerca. Mis nervios no soportan lo cerca.",
      ],
    },
    answer: {
      plain: ["Bueno, sin pánico. Aquí está."],
      flavor: [
        "Aquí está. No volvamos a hablar de esto.",
        "¡Rápido, antes de que desaparezca!",
        "Uf. Bueno. Así es como funciona.",
      ],
    },
    streak: {
      plain: ["¿Tres seguidas? ¿Quién ERES?"],
      flavor: [
        "¡Para, para, no aguanto una racha!",
        "¡Tres! Necesito sentarme.",
      ],
    },
    comeback: {
      plain: ["Volviste. De ESO."],
      flavor: [
        "Arreglado. Nunca más dudo de ti. Hasta la próxima.",
        "Uf. Pensé que esa nos había ganado.",
      ],
    },
    last: {
      plain: ["Se acabó. Lo logramos."],
      flavor: ["Necesito acostarme.", "La última. Me fallaron las rodillas."],
    },
    perfect: {
      plain: ["Perfecto. PERFECTO. Necesito sentarme."],
      flavor: ["Nada explotó. Ni una vez.", "¿Todas? Me voy a desmayar."],
    },
  },
}
