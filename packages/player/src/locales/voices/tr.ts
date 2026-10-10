import type { Voices } from "../../voices"

// Türkçe (sen). Default kısa ve net, Sensei sakin bir usta, Unhinged ise çeviri gibi değil, insan gibi
// konuşan bir sinir küpü.

export const tr: Voices = {
  default: {
    praise: {
      plain: ["Doğru.", "Aynen öyle."],
      flavor: [
        "Aferin!",
        "Kesinlikle.",
        "Buldun.",
        "Tam isabet.",
        "İyi gördün.",
        "İşte bu.",
        "O işte.",
        "Çok iyi.",
      ],
    },
    correctWithHint: {
      plain: ["Doğru, ipucuyla."],
      flavor: [
        "İpucu işini yaptı.",
        "Güzel çözdün.",
        "İpucuyla da olsa buldun.",
      ],
    },
    goodGuess: {
      plain: ["İyi tahmin!"],
      flavor: ["İyi sezgi.", "İyi karar.", "Keskin tahmin."],
    },
    hookMiss: {
      plain: ["Tam değil, sorun yok."],
      flavor: [
        "İyi deneme. Bakalım neden.",
        "Tam değil. Nedenini birazdan göreceksin.",
      ],
    },
    nudge: {
      plain: ["Tam değil. Bir daha bak."],
      flavor: [
        "Az kaldı. Bir daha dene.",
        "Bir bakış daha, tamamdır.",
        "Bir daha bak. Bence yakalarsın.",
      ],
    },
    close: {
      plain: ["Yakın, ama en iyisi değil."],
      flavor: [
        "Az kaldı. Başka bir seçenek daha iyi oturuyor.",
        "İyi, ama en iyisi değil.",
      ],
    },
    answer: {
      plain: ["İşte cevap."],
      flavor: [
        "İşte böyle çalışıyor.",
        "Bu zordu. İşte cevap.",
        "Cevaba bakalım.",
      ],
    },
    streak: {
      plain: ["Üst üste üç."],
      flavor: ["Seri yakaladın.", "Bu bir seri."],
    },
    comeback: {
      plain: ["İşte bu."],
      flavor: ["Bu sefer oldu.", "İyi toparladın."],
    },
    last: {
      plain: ["Sonuncusu da doğru."],
      flavor: ["Ders buydu.", "Güçlü bitirdin."],
    },
    perfect: {
      plain: ["Hepsi doğru."],
      flavor: ["Tek hata yok.", "Düzeltilecek bir şey yok."],
    },
  },
  sensei: {
    praise: {
      plain: ["Güzel. Bu kadar.", "Evet."],
      flavor: [
        "Gördün.",
        "İyi gözlem.",
        "Tam da böyle.",
        "Gözün keskinleşiyor.",
        "Evet. Sessizce, sağlam.",
        "Yol budur.",
        "Güzel. Bunu sakla.",
      ],
    },
    correctWithHint: {
      plain: ["Doğru. İpucu yolu gösterdi, sen yürüdün."],
      flavor: [
        "Sormak da bir beceridir.",
        "Yardım alındı, ders kaldı.",
        "İpucu bir eldir, koltuk değneği değil.",
      ],
    },
    goodGuess: {
      plain: ["İyi bir tahmin."],
      flavor: [
        "Sezgin senin henüz bilmediğin şeyleri biliyor.",
        "Hisse güven, sonra sına.",
        "İyi tahmin. Şimdi nedenine bakalım.",
      ],
    },
    hookMiss: {
      plain: ["Henüz değil, mesele de bu zaten."],
      flavor: [
        "Bir tahmin bize nereden başlayacağımızı gösterir.",
        "Önemli değil. Ders burada başlıyor.",
      ],
    },
    nudge: {
      plain: ["Henüz değil. Bir kez daha bak."],
      flavor: [
        "Yavaş. Orada.",
        "Nefes al, sonra tekrar bak.",
        "Cevap yerinden kıpırdamadı.",
      ],
    },
    close: {
      plain: ["Yakın. Biri daha iyi oturuyor."],
      flavor: [
        "İyi göz. Şimdi en iyisini bul.",
        "Az kaldı. Daha keskin olanı ara.",
      ],
    },
    answer: {
      plain: ["İşte cevap."],
      flavor: [
        "Bununla biraz otur.",
        "Zor olanlar en çok öğretir. İşte cevap.",
        "İşte cevap. Yavaşça oku.",
      ],
    },
    streak: {
      plain: ["Üst üste üç. Sakin."],
      flavor: ["Ritmini buldun.", "Sakin eller, berrak gözler."],
    },
    comeback: {
      plain: ["Bir daha baktın ve oradaydı."],
      flavor: ["Böyle öğrenilir.", "İkinci bakış dersin kendisidir."],
    },
    last: {
      plain: ["Ve ders bu. İyi yürüdün."],
      flavor: ["Son adım da bir adımdır.", "Başladığını bitirdin."],
    },
    perfect: {
      plain: ["Tek bir tökezleme yok. Bunu yanında götür."],
      flavor: [
        "Sakin bir zihin berrak görür.",
        "Düzeltilecek bir şey yok. Sadece hatırlanacak.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Doğru. Nefes al.", "Doğru. Kimse panik yapmasın."],
      flavor: [
        "Aa! Doğru. Gerçekten doğru!",
        "Oh be, başardın!",
        "Bunun işe yaradığına inanamıyorum.",
        "Of. Bittik sandım.",
        "Gözüm seğirmeyi bıraktı. Doğru.",
        "Başardın ve hiçbir şey patlamadı!",
        "Doğru. Kalbim buna dayanmıyor.",
      ],
    },
    correctWithHint: {
      plain: ["İpucu. Doğru. Nefes al."],
      flavor: [
        "İpucu ikimizi de kurtardı.",
        "Of, ipucu ve bitti. Titriyorum.",
        "İpucu işe yaradı. Gerçekten yaradı!",
      ],
    },
    goodGuess: {
      plain: ["Dur, öylece biliyor muydun?"],
      flavor: [
        "Aa! Nereden bildin?",
        "O tahmin fazla doğruydu.",
        "Nasıl? Beni mi izliyorsun?",
      ],
    },
    hookMiss: {
      plain: ["Sorun yok. Gerçekten sorun yok."],
      flavor: [
        "Yanlış, ama sadece tahmindi. Nefes al.",
        "Kimse görmedi. Devam.",
        "Merak etme, senin yerine ben ederim.",
      ],
    },
    nudge: {
      plain: ["O değil. Bir daha bak."],
      flavor: [
        "Olamaz, olamaz. Bir bakış daha?",
        "Tamam, derin nefes. Bir daha bak.",
        "O değil, ama hâlâ düzeltebilirsin.",
      ],
    },
    close: {
      plain: ["Çok yakın. Neden hep bu kadar yakın?"],
      flavor: [
        "Az kaldı. Bu neredeyse daha kötü.",
        "Daha iyisi var, yemin ederim.",
        "Yakın. Sinirlerim yakına dayanmıyor.",
      ],
    },
    answer: {
      plain: ["Tamam, panik yok. İşte cevap."],
      flavor: [
        "İşte cevap. Bundan bir daha hiç bahsetmeyelim.",
        "Çabuk, kaybolmadan!",
        "Of. Tamam. İşte böyle çalışıyor.",
      ],
    },
    streak: {
      plain: ["Üst üste üç mü? Sen KİMSİN?"],
      flavor: ["Dur, dur, seriye dayanamıyorum!", "Üç! Oturmam lazım."],
    },
    comeback: {
      plain: ["Geri döndün. ONDAN sonra."],
      flavor: [
        "Düzeldi. Bir daha senden asla şüphe etmem. Bir dahakine kadar.",
        "Of. O bizi bitirdi sandım.",
      ],
    },
    last: {
      plain: ["Bitti. Başardık."],
      flavor: ["Uzanmam lazım.", "Sonuncu. Dizlerim çözüldü."],
    },
    perfect: {
      plain: ["Mükemmel. MÜKEMMEL. Oturmam lazım."],
      flavor: ["Hiçbir şey patlamadı. Bir kez bile.", "Hepsi mi? Bayılacağım."],
    },
  },
}
