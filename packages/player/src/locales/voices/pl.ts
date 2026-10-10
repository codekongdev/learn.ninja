import type { PartialVoices } from "../../voices"

// pl: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const pl: PartialVoices = {
  default: {
    praise: {
      plain: ["O to chodzi"],
      flavor: [
        "Dobra robota",
        "Dokładnie",
        "Masz to",
        "W punkt",
        "Właśnie ta",
        "Dobre oko",
        "Zgadza się",
      ],
    },
    correctWithHint: {
      plain: ["Dobrze, z podpowiedzią"],
      flavor: [
        "Z podpowiedzią, ale jest",
        "Podpowiedź użyta, odpowiedź znaleziona",
        "Ładnie rozwiązane",
      ],
    },
    goodGuess: {
      plain: ["Dobry strzał!"],
      flavor: ["Niezła intuicja", "Dobry wybór", "Celny strzał"],
    },
    hookMiss: {
      plain: ["Nie do końca, i to nic"],
      flavor: [
        "Nie tym razem, i to nic",
        "Dobra próba. Sprawdźmy dlaczego",
        "Nie do końca. Zaraz zobaczysz dlaczego",
      ],
    },
    nudge: {
      plain: ["Spójrz jeszcze raz. Myślę, że to znajdziesz."],
      flavor: [
        "Nie do końca. Przyjrzyj się jeszcze raz.",
        "Prawie. Spróbuj jeszcze raz.",
        "Jeszcze jedno spojrzenie powinno wystarczyć.",
      ],
    },
    close: {
      plain: ["Blisko, ale to nie najlepsza"],
      flavor: [
        "Prawie. Jest lepsza",
        "Dobra, ale nie najlepsza",
        "Blisko. Jedna opcja pasuje lepiej",
      ],
    },
    answer: {
      plain: ["Oto odpowiedź"],
      flavor: [
        "Tak to działa",
        "Spójrzmy na odpowiedź",
        "To było trudne. Oto odpowiedź",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Aaa! Dobrze. Naprawdę dobrze"],
      flavor: [
        "O rany, o rany, udało się",
        "Nie wierzę, że to zadziałało",
        "Uff. Myślałem, że już po nas",
        "Dobrze. Tylko bez paniki",
        "Oko przestało mi drgać. Dobrze",
        "Udało się i nic nie wybuchło",
        "Dobrze. Moje serce tego nie wytrzyma",
      ],
    },
    correctWithHint: {
      plain: ["Podpowiedź nas uratowała"],
      flavor: [
        "Uff, podpowiedź i gotowe. Cały drżę",
        "Potrzebna była pomoc i to nic",
        "Podpowiedź zadziałała. Naprawdę",
      ],
    },
    goodGuess: {
      plain: ["Aaa! Jak to możliwe?"],
      flavor: [
        "Czekaj, tak po prostu wiesz?",
        "Ten strzał był aż za dobry",
        "Jak? Obserwujesz mnie?",
      ],
    },
    hookMiss: {
      plain: ["Aaa! Jest dobrze. Jest całkiem dobrze"],
      flavor: [
        "Źle, ale to tylko strzał. Oddychaj",
        "Nikt tego nie widział. Dalej",
        "Spokojnie, ja się martwię za ciebie",
      ],
    },
    nudge: {
      plain: ["Aaa! Nie ta. Spójrz jeszcze raz"],
      flavor: [
        "O nie, o nie. Jeszcze jedno spojrzenie?",
        "Dobra, głęboki wdech. Spójrz jeszcze raz",
        "Nie to, ale da się to jeszcze naprawić",
      ],
    },
    close: {
      plain: ["Tak blisko. Czemu zawsze tak blisko?"],
      flavor: [
        "Prawie. To prawie gorsze",
        "Jest lepsza, przysięgam",
        "Blisko. Moje nerwy tego nie zniosą",
      ],
    },
    answer: {
      plain: ["Dobra, dobra, bez paniki. Oto ona"],
      flavor: [
        "Oto ona. Nigdy więcej o tym nie mówmy",
        "Szybko, zanim zniknie",
        "Uff. Dobra. Tak to działa",
      ],
    },
  },
}
