import type { Voices } from "../../voices"

// Polski (ty). Default jest krótki i jasny, Sensei to spokojny mistrz, a Unhinged to kłębek nerwów,
// który mówi tak, jak się mówi, a nie jak się tłumaczy.

export const pl: Voices = {
  default: {
    praise: {
      plain: ["Dobrze.", "Zgadza się."],
      flavor: [
        "Świetna robota!",
        "Dokładnie.",
        "Masz to.",
        "W punkt.",
        "Dobrze zauważone.",
        "No proszę.",
        "To ta.",
        "Bardzo dobrze.",
      ],
    },
    correctWithHint: {
      plain: ["Dobrze, z podpowiedzią."],
      flavor: [
        "Podpowiedź zrobiła swoje.",
        "Ładnie rozwiązane.",
        "Z podpowiedzią, ale jest.",
      ],
    },
    goodGuess: {
      plain: ["Dobry strzał!"],
      flavor: ["Dobry instynkt.", "Dobry wybór.", "Celny strzał."],
    },
    hookMiss: {
      plain: ["Nie całkiem, i to w porządku."],
      flavor: [
        "Dobra próba. Zobaczmy dlaczego.",
        "Nie całkiem. Zaraz zobaczysz dlaczego.",
      ],
    },
    nudge: {
      plain: ["Nie całkiem. Spójrz jeszcze raz."],
      flavor: [
        "Prawie. Spróbuj jeszcze raz.",
        "Jeszcze jedno spojrzenie i będzie.",
        "Spójrz jeszcze raz. Myślę, że to wyłapiesz.",
      ],
    },
    close: {
      plain: ["Blisko, ale to nie najlepsza."],
      flavor: [
        "Prawie. Inna opcja pasuje lepiej.",
        "Dobrze, ale nie najlepiej.",
      ],
    },
    answer: {
      plain: ["Oto odpowiedź."],
      flavor: [
        "Tak to działa.",
        "To było podchwytliwe. Oto ona.",
        "Spójrzmy na odpowiedź.",
      ],
    },
    streak: {
      plain: ["Trzy z rzędu."],
      flavor: ["Idzie ci jak z płatka.", "To już seria."],
    },
    comeback: {
      plain: ["Jest."],
      flavor: ["Tym razem tak.", "Dobre odrobienie."],
    },
    last: {
      plain: ["Ostatnie, i dobrze."],
      flavor: ["To była cała lekcja.", "Mocne zakończenie."],
    },
    perfect: {
      plain: ["Wszystko dobrze."],
      flavor: ["Bez jednego błędu.", "Nie ma czego poprawiać."],
    },
  },
  sensei: {
    praise: {
      plain: ["Dobrze. To jest to.", "Tak."],
      flavor: [
        "Zobaczyłeś to.",
        "Dobrze dostrzeżone.",
        "Właśnie tak.",
        "Twoje oko się wyostrza.",
        "Tak. Cicho i pewnie.",
        "To jest droga.",
        "Dobrze. Zachowaj to.",
      ],
    },
    correctWithHint: {
      plain: ["Dobrze. Podpowiedź wskazała drogę, ty nią poszedłeś."],
      flavor: [
        "Pytanie to też umiejętność.",
        "Pomoc przyjęta, lekcja zachowana.",
        "Podpowiedź to dłoń, nie kula.",
      ],
    },
    goodGuess: {
      plain: ["Dobry strzał."],
      flavor: [
        "Twój instynkt wie rzeczy, których ty jeszcze nie wiesz.",
        "Zaufaj przeczuciu, potem je sprawdź.",
        "Dobrze wyczute. Teraz zobaczmy dlaczego.",
      ],
    },
    hookMiss: {
      plain: ["Jeszcze nie, i o to chodzi."],
      flavor: [
        "Strzał pokazuje nam, od czego zacząć.",
        "Nie szkodzi. Lekcja zaczyna się tutaj.",
      ],
    },
    nudge: {
      plain: ["Jeszcze nie. Spójrz raz jeszcze."],
      flavor: [
        "Powoli. To tam jest.",
        "Oddech, potem spójrz ponownie.",
        "Odpowiedź się nie ruszyła.",
      ],
    },
    close: {
      plain: ["Blisko. Jedna pasuje lepiej."],
      flavor: [
        "Dobre oko. Teraz znajdź najlepszą.",
        "Prawie. Szukaj tej ostrzejszej.",
      ],
    },
    answer: {
      plain: ["Oto odpowiedź."],
      flavor: [
        "Zatrzymaj się przy tej na chwilę.",
        "Trudne uczą najwięcej. Oto ona.",
        "Oto odpowiedź. Przeczytaj ją powoli.",
      ],
    },
    streak: {
      plain: ["Trzy z rzędu. Spokojnie."],
      flavor: ["Znalazłeś swój rytm.", "Spokojne ręce, jasne oczy."],
    },
    comeback: {
      plain: ["Spojrzałeś jeszcze raz, i tam było."],
      flavor: ["Tak się uczy.", "Drugie spojrzenie jest lekcją."],
    },
    last: {
      plain: ["I to jest lekcja. Dobrze przebyta."],
      flavor: ["Ostatni krok to wciąż krok.", "Dokończyłeś, co zacząłeś."],
    },
    perfect: {
      plain: ["Ani jednego potknięcia. Zabierz to ze sobą."],
      flavor: [
        "Spokojny umysł widzi jasno.",
        "Nie ma czego poprawiać. Tylko zapamiętać.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Dobrze. Oddychaj.", "Jest dobrze. Bez paniki."],
      flavor: [
        "O rety! Jest dobrze. Naprawdę dobrze!",
        "O matko, udało się!",
        "Nie wierzę, że to zadziałało.",
        "Uff. Myślałem, że po nas.",
        "Oko przestało mi drgać. Dobrze.",
        "Udało się i nic nie wybuchło!",
        "Dobrze. Moje serce tego nie wytrzyma.",
      ],
    },
    correctWithHint: {
      plain: ["Podpowiedź. Dobrze. Oddychaj."],
      flavor: [
        "Podpowiedź uratowała nas oboje.",
        "Uff, podpowiedź i po sprawie. Trzęsę się.",
        "Podpowiedź zadziałała. Naprawdę zadziałała!",
      ],
    },
    goodGuess: {
      plain: ["Chwila, po prostu wiedziałeś?"],
      flavor: [
        "O rety! Skąd wiedziałeś?",
        "Ten strzał był zbyt celny.",
        "Jak? Podglądasz mnie?",
      ],
    },
    hookMiss: {
      plain: ["Jest okej. Naprawdę jest okej."],
      flavor: [
        "Źle, ale to tylko strzał. Oddychaj.",
        "Nikt nie widział. Idziemy dalej.",
        "Nie martw się, ja się martwię za ciebie.",
      ],
    },
    nudge: {
      plain: ["Nie ta. Spójrz jeszcze raz."],
      flavor: [
        "O nie, o nie. Jeszcze jedno spojrzenie?",
        "Dobra, głęboki oddech. Spójrz jeszcze raz.",
        "Nie ta, ale wciąż możesz to naprawić.",
      ],
    },
    close: {
      plain: ["Tak blisko. Czemu zawsze tak blisko?"],
      flavor: [
        "Prawie. To prawie gorsze.",
        "Jest lepsza, przysięgam.",
        "Blisko. Moje nerwy nie znoszą blisko.",
      ],
    },
    answer: {
      plain: ["Dobra, bez paniki. Oto ona."],
      flavor: [
        "Oto ona. Nigdy więcej o tym nie mówmy.",
        "Szybko, zanim zniknie!",
        "Uff. Dobra. Tak to działa.",
      ],
    },
    streak: {
      plain: ["Trzy z rzędu? Kim ty JESTEŚ?"],
      flavor: ["Stop, stop, nie wytrzymam serii!", "Trzy! Muszę usiąść."],
    },
    comeback: {
      plain: ["Wróciłeś. Po TYM."],
      flavor: [
        "Naprawione. Nigdy więcej w ciebie nie zwątpię. Do następnego razu.",
        "Uff. Myślałem, że to nas załatwiło.",
      ],
    },
    last: {
      plain: ["Koniec. Udało się."],
      flavor: ["Muszę się położyć.", "Ostatnie. Kolana mi zmiękły."],
    },
    perfect: {
      plain: ["Idealnie. IDEALNIE. Muszę usiąść."],
      flavor: ["Nic nie wybuchło. Ani razu.", "Wszystkie? Zaraz zemdleję."],
    },
  },
}
