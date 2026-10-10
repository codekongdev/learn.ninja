import type { PartialVoices } from "../../voices"

// vi: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const vi: PartialVoices = {
  default: {
    praise: {
      plain: ["Đúng rồi"],
      flavor: [
        "Làm tốt lắm",
        "Chính xác",
        "Bạn đã hiểu",
        "Chuẩn luôn",
        "Chính là nó",
        "Tinh mắt đấy",
        "Hay lắm",
      ],
    },
    correctWithHint: {
      plain: ["Chính xác, có gợi ý"],
      flavor: [
        "Nhờ gợi ý mà ra",
        "Dùng gợi ý, tìm ra đáp án",
        "Suy luận tốt lắm",
      ],
    },
    goodGuess: {
      plain: ["Đoán hay đấy!"],
      flavor: ["Trực giác tốt", "Chọn đúng đấy", "Đoán chuẩn thật"],
    },
    hookMiss: {
      plain: ["Chưa đúng lắm, và không sao cả"],
      flavor: [
        "Lần này chưa trúng, và không sao cả",
        "Thử hay đấy. Cùng xem vì sao nhé",
        "Chưa đúng lắm. Bạn sẽ sớm hiểu vì sao",
      ],
    },
    nudge: {
      plain: ["Nhìn lại một lần nữa nhé. Mình nghĩ bạn sẽ tìm ra."],
      flavor: [
        "Chưa đúng lắm. Nhìn lại nhé.",
        "Gần rồi. Thử lại lần nữa nhé.",
        "Nhìn thêm một lần là ra thôi.",
      ],
    },
    close: {
      plain: ["Gần đúng, nhưng chưa phải tốt nhất"],
      flavor: [
        "Suýt rồi. Có đáp án tốt hơn",
        "Tốt, nhưng chưa phải tốt nhất",
        "Gần rồi. Có lựa chọn hợp hơn",
      ],
    },
    answer: {
      plain: ["Đây là đáp án"],
      flavor: [
        "Đây là cách nó hoạt động",
        "Cùng xem đáp án nhé",
        "Câu này khó. Đáp án đây",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["Á! Đúng rồi. Đúng thật rồi"],
      flavor: [
        "Ôi, ôi, bạn làm được rồi",
        "Không tin nổi là được",
        "Phù. Mình tưởng toi rồi",
        "Đúng rồi. Không ai hoảng nhé",
        "Mắt mình hết giật rồi. Đúng",
        "Bạn làm được mà không gì nổ tung",
        "Đúng. Tim mình chịu không nổi",
      ],
    },
    correctWithHint: {
      plain: ["Gợi ý đã cứu cả hai mình"],
      flavor: [
        "Phù, gợi ý xong là xong. Mình run quá",
        "Mình cần trợ giúp, và vậy là ổn",
        "Gợi ý hiệu quả. Hiệu quả thật",
      ],
    },
    goodGuess: {
      plain: ["Á! Sao bạn biết?"],
      flavor: [
        "Khoan, bạn biết luôn à?",
        "Đoán gì mà đúng quá vậy",
        "Sao được? Bạn theo dõi mình à?",
      ],
    },
    hookMiss: {
      plain: ["Á! Không sao. Hoàn toàn không sao"],
      flavor: [
        "Sai, nhưng chỉ là đoán thôi. Thở đi",
        "Không ai thấy đâu. Đi tiếp",
        "Đừng lo, để mình lo thay",
      ],
    },
    nudge: {
      plain: ["Á! Không phải câu đó. Nhìn lại đi"],
      flavor: [
        "Ôi không, ôi không. Nhìn lại nhé?",
        "Rồi, hít thở sâu. Nhìn lại nào",
        "Chưa đúng, nhưng vẫn sửa kịp",
      ],
    },
    close: {
      plain: ["Sát quá. Sao lúc nào cũng sát vậy?"],
      flavor: [
        "Suýt. Vậy còn tệ hơn",
        "Có câu tốt hơn, thề luôn",
        "Gần rồi. Thần kinh mình chịu hết nổi",
      ],
    },
    answer: {
      plain: ["Rồi, rồi, đừng hoảng. Đây này"],
      flavor: [
        "Đây. Đừng bao giờ nhắc lại nhé",
        "Nhanh, trước khi nó biến mất",
        "Phù. Rồi. Nó hoạt động thế này",
      ],
    },
  },
}
