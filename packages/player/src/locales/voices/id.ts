import type { PartialVoices } from "../../voices"

// id: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const id: PartialVoices = {
  default: {
    praise: {
      plain: ["Nah, itu dia"],
      flavor: [
        "Kerja bagus",
        "Tepat",
        "Kamu benar",
        "Pas sekali",
        "Itu jawabannya",
        "Jeli sekali",
        "Mantap",
      ],
    },
    correctWithHint: {
      plain: ["Benar, dengan petunjuk"],
      flavor: [
        "Berhasil dengan petunjuk",
        "Pakai petunjuk, jawaban ketemu",
        "Dipikirkan dengan baik",
      ],
    },
    goodGuess: {
      plain: ["Tebakan bagus!"],
      flavor: ["Insting yang bagus", "Pilihan tepat", "Tebakan jitu"],
    },
    hookMiss: {
      plain: ["Belum tepat, dan tidak apa-apa"],
      flavor: [
        "Bukan kali ini, dan tidak apa-apa",
        "Usaha bagus. Ayo cari tahu kenapa",
        "Belum tepat. Nanti kamu lihat kenapa",
      ],
    },
    nudge: {
      plain: ["Lihat sekali lagi. Kamu pasti bisa menemukannya."],
      flavor: [
        "Belum tepat. Coba lihat lagi.",
        "Hampir. Coba sekali lagi.",
        "Sekali lihat lagi pasti ketemu.",
      ],
    },
    close: {
      plain: ["Hampir, tapi bukan yang terbaik"],
      flavor: [
        "Nyaris. Ada yang lebih baik",
        "Bagus, tapi bukan yang terbaik",
        "Hampir. Ada pilihan yang lebih pas",
      ],
    },
    answer: {
      plain: ["Ini jawabannya"],
      flavor: [
        "Begini cara kerjanya",
        "Ayo lihat jawabannya",
        "Yang ini sulit. Ini dia",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Waduh! Benar. Beneran benar"],
      flavor: [
        "Ya ampun, ya ampun, kamu berhasil",
        "Aku tak percaya itu berhasil",
        "Fiuh. Kukira kita tamat",
        "Benar. Semua jangan panik",
        "Mataku berhenti berkedut. Benar",
        "Kamu berhasil dan tak ada yang meledak",
        "Benar. Jantungku tak kuat",
      ],
    },
    correctWithHint: {
      plain: ["Petunjuknya menyelamatkan kita berdua"],
      flavor: [
        "Fiuh, petunjuk lalu beres. Aku gemetar",
        "Kita butuh bantuan, dan itu tidak apa-apa",
        "Petunjuknya berhasil. Beneran berhasil",
      ],
    },
    goodGuess: {
      plain: ["Waduh! Kok kamu tahu?"],
      flavor: [
        "Tunggu, kamu langsung tahu?",
        "Tebakan itu terlalu benar",
        "Kok bisa? Kamu mengawasiku?",
      ],
    },
    hookMiss: {
      plain: ["Waduh! Tidak apa-apa. Sungguh tidak apa-apa"],
      flavor: [
        "Salah, tapi cuma tebakan. Tarik napas",
        "Tak ada yang lihat. Lanjut",
        "Jangan khawatir, biar aku yang khawatir",
      ],
    },
    nudge: {
      plain: ["Waduh! Bukan yang itu. Lihat lagi"],
      flavor: [
        "Aduh, aduh. Lihat sekali lagi?",
        "Oke, tarik napas. Lihat lagi",
        "Bukan, tapi masih bisa diperbaiki",
      ],
    },
    close: {
      plain: ["Dekat sekali. Kenapa selalu dekat sekali?"],
      flavor: [
        "Nyaris. Itu malah lebih parah",
        "Ada yang lebih baik, sumpah",
        "Hampir. Sarafku tak kuat dengan hampir",
      ],
    },
    answer: {
      plain: ["Oke, oke, jangan panik. Ini dia"],
      flavor: [
        "Ini dia. Jangan pernah bahas ini lagi",
        "Cepat, sebelum hilang",
        "Fiuh. Oke. Begini cara kerjanya",
      ],
    },
  },
}
