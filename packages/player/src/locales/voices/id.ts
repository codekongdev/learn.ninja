import type { Voices } from "../../voices"

// Bahasa Indonesia santai (kamu). Default singkat dan jelas, Sensei guru yang tenang, dan Unhinged
// gugup berat dan bicara seperti orang bicara, bukan seperti terjemahan.

export const id: Voices = {
  default: {
    praise: {
      plain: ["Benar.", "Tepat."],
      flavor: [
        "Kerja bagus!",
        "Persis.",
        "Kamu dapat.",
        "Tepat sasaran.",
        "Jeli.",
        "Nah, itu dia.",
        "Yang itu.",
        "Bagus sekali.",
      ],
    },
    correctWithHint: {
      plain: ["Benar, dengan petunjuk."],
      flavor: [
        "Petunjuknya berhasil.",
        "Dipecahkan dengan rapi.",
        "Pakai petunjuk, tapi sampai juga.",
      ],
    },
    goodGuess: {
      plain: ["Tebakan bagus!"],
      flavor: ["Naluri yang bagus.", "Pilihan tepat.", "Tebakan jitu."],
    },
    hookMiss: {
      plain: ["Belum tepat, dan tidak apa-apa."],
      flavor: [
        "Usaha bagus. Mari lihat kenapa.",
        "Belum tepat. Sebentar lagi kamu tahu kenapa.",
      ],
    },
    nudge: {
      plain: ["Belum tepat. Lihat lagi."],
      flavor: [
        "Hampir. Coba sekali lagi.",
        "Sekali lihat lagi, pasti dapat.",
        "Lihat sekali lagi. Kurasa kamu bisa menangkapnya.",
      ],
    },
    close: {
      plain: ["Dekat, tapi bukan yang terbaik."],
      flavor: [
        "Hampir. Pilihan lain lebih pas.",
        "Bagus, tapi bukan yang terbaik.",
      ],
    },
    answer: {
      plain: ["Ini jawabannya."],
      flavor: [
        "Begini cara kerjanya.",
        "Yang ini sulit. Ini jawabannya.",
        "Mari lihat jawabannya.",
      ],
    },
    streak: {
      plain: ["Tiga berturut-turut."],
      flavor: ["Lagi lancar.", "Itu baru rentetan."],
    },
    comeback: {
      plain: ["Nah, itu dia."],
      flavor: ["Kali ini dapat.", "Pemulihan yang bagus."],
    },
    last: {
      plain: ["Yang terakhir, dan benar."],
      flavor: ["Itulah pelajarannya.", "Diakhiri dengan kuat."],
    },
    perfect: {
      plain: ["Semua benar."],
      flavor: ["Tanpa satu pun salah.", "Tidak ada yang perlu diperbaiki."],
    },
  },
  sensei: {
    praise: {
      plain: ["Bagus. Itu dia.", "Ya."],
      flavor: [
        "Kamu melihatnya.",
        "Pengamatan yang baik.",
        "Persis begitu.",
        "Matamu makin tajam.",
        "Ya. Tenang dan mantap.",
        "Itulah jalannya.",
        "Bagus. Simpan itu.",
      ],
    },
    correctWithHint: {
      plain: ["Benar. Petunjuk menunjukkan jalan, kamu yang menempuhnya."],
      flavor: [
        "Bertanya juga sebuah keterampilan.",
        "Bantuan diterima, pelajaran tersimpan.",
        "Petunjuk adalah uluran tangan, bukan tongkat.",
      ],
    },
    goodGuess: {
      plain: ["Tebakan yang baik."],
      flavor: [
        "Nalurimu tahu hal yang belum kamu tahu.",
        "Percayai firasat, lalu uji.",
        "Tebakan bagus. Sekarang mari lihat kenapa.",
      ],
    },
    hookMiss: {
      plain: ["Belum, dan memang itu intinya."],
      flavor: [
        "Tebakan menunjukkan dari mana kita mulai.",
        "Tidak apa-apa. Pelajaran dimulai di sini.",
      ],
    },
    nudge: {
      plain: ["Belum. Lihat sekali lagi."],
      flavor: [
        "Pelan-pelan. Ada di situ.",
        "Tarik napas, lalu lihat lagi.",
        "Jawabannya tidak pindah.",
      ],
    },
    close: {
      plain: ["Dekat. Satu lebih pas."],
      flavor: [
        "Mata yang jeli. Sekarang cari yang terbaik.",
        "Hampir. Cari yang lebih tepat.",
      ],
    },
    answer: {
      plain: ["Ini jawabannya."],
      flavor: [
        "Renungkan yang ini sejenak.",
        "Yang sulit mengajarkan paling banyak. Ini jawabannya.",
        "Ini jawabannya. Baca pelan-pelan.",
      ],
    },
    streak: {
      plain: ["Tiga berturut-turut. Tetap tenang."],
      flavor: ["Kamu menemukan ritmemu.", "Tangan tenang, mata jernih."],
    },
    comeback: {
      plain: ["Kamu melihat lagi, dan di situlah dia."],
      flavor: [
        "Begitulah cara belajar.",
        "Pandangan kedua adalah pelajarannya.",
      ],
    },
    last: {
      plain: ["Dan itulah pelajarannya. Ditempuh dengan baik."],
      flavor: [
        "Langkah terakhir tetaplah langkah.",
        "Kamu menyelesaikan yang kamu mulai.",
      ],
    },
    perfect: {
      plain: ["Tanpa satu pun tersandung. Bawa itu bersamamu."],
      flavor: [
        "Pikiran tenang melihat jernih.",
        "Tidak ada yang diperbaiki. Hanya diingat.",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Benar. Tarik napas.", "Benar. Jangan ada yang panik."],
      flavor: [
        "Waduh! Benar. Beneran benar!",
        "Astaga, kamu berhasil!",
        "Nggak nyangka itu berhasil.",
        "Fiuh. Kukira kita tamat.",
        "Mataku berhenti kedutan. Benar.",
        "Kamu berhasil dan tidak ada yang meledak!",
        "Benar. Jantungku nggak kuat.",
      ],
    },
    correctWithHint: {
      plain: ["Petunjuk. Benar. Tarik napas."],
      flavor: [
        "Petunjuknya menyelamatkan kita berdua.",
        "Fiuh, petunjuk dan beres. Aku gemetar.",
        "Petunjuknya berhasil. Beneran berhasil!",
      ],
    },
    goodGuess: {
      plain: ["Tunggu, kamu tahu begitu saja?"],
      flavor: [
        "Waduh! Kok bisa tahu?",
        "Tebakan itu terlalu tepat.",
        "Gimana caranya? Kamu ngawasin aku?",
      ],
    },
    hookMiss: {
      plain: ["Nggak apa-apa. Beneran nggak apa-apa."],
      flavor: [
        "Salah, tapi cuma tebakan. Tarik napas.",
        "Nggak ada yang lihat. Lanjut.",
        "Jangan khawatir, aku yang khawatir buat kamu.",
      ],
    },
    nudge: {
      plain: ["Bukan itu. Lihat lagi."],
      flavor: [
        "Aduh, aduh. Lihat sekali lagi?",
        "Oke, tarik napas dalam. Lihat lagi.",
        "Bukan itu, tapi masih bisa diperbaiki.",
      ],
    },
    close: {
      plain: ["Dekat banget. Kenapa selalu dekat banget?"],
      flavor: [
        "Hampir. Itu malah lebih parah.",
        "Ada yang lebih baik, sumpah.",
        "Dekat. Sarafku nggak tahan sama 'dekat'.",
      ],
    },
    answer: {
      plain: ["Oke, jangan panik. Ini jawabannya."],
      flavor: [
        "Ini jawabannya. Jangan pernah bahas ini lagi.",
        "Cepat, sebelum hilang!",
        "Fiuh. Oke. Begini cara kerjanya.",
      ],
    },
    streak: {
      plain: ["Tiga berturut-turut? Kamu ini SIAPA?"],
      flavor: [
        "Stop, stop, aku nggak kuat rentetan!",
        "Tiga! Aku harus duduk.",
      ],
    },
    comeback: {
      plain: ["Kamu kembali. Setelah ITU."],
      flavor: [
        "Beres. Aku nggak akan ragu lagi. Sampai lain kali.",
        "Fiuh. Kukira yang itu menghabisi kita.",
      ],
    },
    last: {
      plain: ["Selesai. Kita berhasil."],
      flavor: ["Aku harus rebahan.", "Yang terakhir. Lututku lemas."],
    },
    perfect: {
      plain: ["Sempurna. SEMPURNA. Aku harus duduk."],
      flavor: [
        "Tidak ada yang meledak. Sekali pun tidak.",
        "Semuanya? Aku mau pingsan.",
      ],
    },
  },
}
