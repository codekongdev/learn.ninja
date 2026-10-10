import type { PartialVoices } from "../../voices"

// tr: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const tr: PartialVoices = {
  default: {
    praise: {
      plain: ["İşte bu"],
      flavor: [
        "Harika iş",
        "Aynen",
        "Buldun",
        "Tam isabet",
        "Doğrusu bu",
        "İyi yakaladın",
        "Çok iyi",
      ],
    },
    correctWithHint: {
      plain: ["Doğru, ipucuyla"],
      flavor: [
        "İpucuyla oldu",
        "İpucu kullanıldı, cevap bulundu",
        "Güzel çözdün",
      ],
    },
    goodGuess: {
      plain: ["İyi tahmin!"],
      flavor: ["Sezgilerin güçlü", "İyi karar", "Keskin tahmin"],
    },
    hookMiss: {
      plain: ["Pek sayılmaz, ama sorun değil"],
      flavor: [
        "Bu sefer olmadı, sorun değil",
        "İyi deneme. Hadi nedenini görelim",
        "Pek sayılmaz. Nedenini birazdan göreceksin",
      ],
    },
    nudge: {
      plain: ["Bir daha bak. Bence bulacaksın."],
      flavor: [
        "Pek sayılmaz. Bir daha bak.",
        "Az kaldı. Bir daha dene.",
        "Bir kez daha bakınca olacak.",
      ],
    },
    close: {
      plain: ["Yakın, ama en iyisi değil"],
      flavor: [
        "Az kaldı. Daha iyisi var",
        "İyi, ama en iyisi değil",
        "Yakın. Bir seçenek daha uygun",
      ],
    },
    answer: {
      plain: ["İşte cevap"],
      flavor: [
        "Şöyle işliyor",
        "Cevaba bir bakalım",
        "Bu biraz zordu. İşte cevap",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Aah! Doğru. Gerçekten doğru"],
      flavor: [
        "Aman aman, başardın",
        "Bunun işe yaradığına inanamıyorum",
        "Of. Mahvolduk sanmıştım",
        "Doğru. Kimse panik yapmasın",
        "Gözümün seğirmesi durdu. Doğru",
        "Başardın ve hiçbir şey patlamadı",
        "Doğru. Kalbim bunu kaldıramaz",
      ],
    },
    correctWithHint: {
      plain: ["İpucu ikimizi de kurtardı"],
      flavor: [
        "Of, ipucu ve bitti. Titriyorum",
        "Yardım lazımdı, bunda sorun yok",
        "İpucu işe yaradı. Gerçekten yaradı",
      ],
    },
    goodGuess: {
      plain: ["Aah! Nereden bildin?"],
      flavor: [
        "Dur, öylece bildin mi?",
        "Bu tahmin fazla doğru",
        "Nasıl? Beni mi izliyorsun?",
      ],
    },
    hookMiss: {
      plain: ["Aah! Sorun yok. Hiç sorun yok"],
      flavor: [
        "Yanlış, ama sadece tahmin. Nefes al",
        "Kimse görmedi. Devam",
        "Merak etme, senin yerine ben endişelenirim",
      ],
    },
    nudge: {
      plain: ["Aah! O değil. Bir daha bak"],
      flavor: [
        "Eyvah, eyvah. Bir daha bakar mısın?",
        "Tamam, derin nefes. Bir daha bak",
        "O değil, ama hâlâ düzeltebilirsin",
      ],
    },
    close: {
      plain: ["Çok yakın. Neden hep çok yakın?"],
      flavor: [
        "Az kaldı. Bu daha da kötü",
        "Daha iyisi var, inan bana",
        "Yakın. Sinirlerim buna dayanamıyor",
      ],
    },
    answer: {
      plain: ["Tamam, tamam, panik yok. İşte burada"],
      flavor: [
        "İşte burada. Bunu bir daha hiç konuşmayalım",
        "Çabuk, kaybolmadan önce",
        "Of. Tamam. Şöyle işliyor",
      ],
    },
  },
}
