import type { Voices } from "../../voices"

// Tiếng Việt thân mật (bạn). Default ngắn gọn rõ ràng, Sensei là người thầy điềm tĩnh, còn Unhinged
// là một bó dây thần kinh nói như người ta nói, không phải như bản dịch.

export const vi: Voices = {
  default: {
    praise: {
      plain: ["Đúng rồi.", "Chính xác."],
      flavor: [
        "Làm tốt lắm!",
        "Đúng vậy.",
        "Bạn tìm ra rồi.",
        "Trúng phóc.",
        "Tinh mắt đấy.",
        "Đó, thấy chưa.",
        "Chính nó.",
        "Rất tốt.",
      ],
    },
    correctWithHint: {
      plain: ["Đúng, nhờ gợi ý."],
      flavor: [
        "Gợi ý đã làm việc của nó.",
        "Giải gọn gàng.",
        "Có gợi ý, nhưng vẫn tới đích.",
      ],
    },
    goodGuess: {
      plain: ["Đoán hay!"],
      flavor: ["Trực giác tốt.", "Chọn đúng.", "Đoán sắc bén."],
    },
    hookMiss: {
      plain: ["Chưa đúng, và không sao cả."],
      flavor: [
        "Thử tốt đấy. Xem vì sao nhé.",
        "Chưa đúng. Bạn sẽ sớm hiểu vì sao.",
      ],
    },
    nudge: {
      plain: ["Chưa đúng. Nhìn lại nhé."],
      flavor: [
        "Gần rồi. Thử lại đi.",
        "Nhìn thêm một lần là ra.",
        "Nhìn lại lần nữa. Tôi nghĩ bạn sẽ bắt được.",
      ],
    },
    close: {
      plain: ["Gần đúng, nhưng chưa phải tốt nhất."],
      flavor: [
        "Gần rồi. Có lựa chọn khác hợp hơn.",
        "Tốt, nhưng chưa phải tốt nhất.",
      ],
    },
    answer: {
      plain: ["Đây là đáp án."],
      flavor: [
        "Nó hoạt động như thế này.",
        "Câu này khó. Đây là đáp án.",
        "Cùng xem đáp án nhé.",
      ],
    },
    streak: {
      plain: ["Ba câu liên tiếp."],
      flavor: ["Đang lên đà.", "Đó là một chuỗi."],
    },
    comeback: {
      plain: ["Đó rồi."],
      flavor: ["Lần này được rồi.", "Gỡ lại đẹp."],
    },
    last: {
      plain: ["Câu cuối, và đúng."],
      flavor: ["Đó chính là bài học.", "Kết thúc mạnh mẽ."],
    },
    perfect: {
      plain: ["Đúng hết."],
      flavor: ["Không sai câu nào.", "Không có gì phải sửa."],
    },
  },
  sensei: {
    praise: {
      plain: ["Tốt. Chính là nó.", "Phải."],
      flavor: [
        "Bạn đã thấy nó.",
        "Quan sát tốt.",
        "Đúng như vậy.",
        "Mắt bạn đang sắc hơn.",
        "Phải. Lặng lẽ mà chắc.",
        "Đó là con đường.",
        "Tốt. Giữ lấy điều đó.",
      ],
    },
    correctWithHint: {
      plain: ["Đúng. Gợi ý chỉ đường, bạn là người đi."],
      flavor: [
        "Biết hỏi cũng là một kỹ năng.",
        "Nhận giúp đỡ, giữ bài học.",
        "Gợi ý là bàn tay đỡ, không phải cái nạng.",
      ],
    },
    goodGuess: {
      plain: ["Một phỏng đoán tốt."],
      flavor: [
        "Trực giác của bạn biết điều bạn chưa biết.",
        "Tin vào cảm giác, rồi kiểm chứng nó.",
        "Đoán tốt. Giờ xem vì sao.",
      ],
    },
    hookMiss: {
      plain: ["Chưa, và đó chính là điểm mấu chốt."],
      flavor: [
        "Một phỏng đoán cho ta biết bắt đầu từ đâu.",
        "Không sao. Bài học bắt đầu từ đây.",
      ],
    },
    nudge: {
      plain: ["Chưa. Nhìn thêm lần nữa."],
      flavor: [
        "Chậm lại. Nó ở đó.",
        "Hít thở, rồi nhìn lại.",
        "Đáp án vẫn chưa đi đâu.",
      ],
    },
    close: {
      plain: ["Gần rồi. Có một lựa chọn hợp hơn."],
      flavor: [
        "Mắt tinh. Giờ tìm lựa chọn tốt nhất.",
        "Gần rồi. Tìm cái chính xác hơn.",
      ],
    },
    answer: {
      plain: ["Đây là đáp án."],
      flavor: [
        "Ngẫm câu này một chút.",
        "Câu khó dạy ta nhiều nhất. Đây là đáp án.",
        "Đây là đáp án. Đọc chậm thôi.",
      ],
    },
    streak: {
      plain: ["Ba câu liên tiếp. Giữ vững."],
      flavor: ["Bạn đã tìm được nhịp của mình.", "Tay vững, mắt sáng."],
    },
    comeback: {
      plain: ["Bạn nhìn lại, và nó ở đó."],
      flavor: ["Học là như thế.", "Cái nhìn thứ hai chính là bài học."],
    },
    last: {
      plain: ["Và đó là bài học. Đi trọn vẹn."],
      flavor: [
        "Bước cuối vẫn là một bước.",
        "Bạn đã hoàn thành điều mình bắt đầu.",
      ],
    },
    perfect: {
      plain: ["Không một lần vấp. Mang theo điều đó."],
      flavor: ["Tâm tĩnh thì nhìn rõ.", "Không có gì để sửa. Chỉ để nhớ."],
    },
  },
  unhinged: {
    praise: {
      plain: ["Đúng. Thở đi.", "Đúng rồi. Không ai hoảng nhé."],
      flavor: [
        "Trời ơi! Đúng. Đúng thật luôn!",
        "Ôi trời, bạn làm được rồi!",
        "Không tin nổi là được.",
        "Phù. Tưởng tiêu rồi chứ.",
        "Mắt tôi hết giật rồi. Đúng.",
        "Làm được rồi mà không có gì nổ!",
        "Đúng. Tim tôi chịu không nổi.",
      ],
    },
    correctWithHint: {
      plain: ["Gợi ý. Đúng. Thở đi."],
      flavor: [
        "Gợi ý cứu cả hai ta.",
        "Phù, gợi ý là xong. Tôi run quá.",
        "Gợi ý có tác dụng. Có tác dụng thật!",
      ],
    },
    goodGuess: {
      plain: ["Khoan, bạn biết sẵn luôn à?"],
      flavor: [
        "Trời ơi! Sao bạn biết?",
        "Đoán gì mà đúng quá vậy.",
        "Sao được? Bạn đang theo dõi tôi à?",
      ],
    },
    hookMiss: {
      plain: ["Không sao. Thật sự không sao."],
      flavor: [
        "Sai, nhưng chỉ là đoán thôi. Thở đi.",
        "Không ai thấy đâu. Đi tiếp.",
        "Đừng lo, để tôi lo giùm bạn.",
      ],
    },
    nudge: {
      plain: ["Không phải cái đó. Nhìn lại đi."],
      flavor: [
        "Ôi không, ôi không. Nhìn thêm lần nữa nhé?",
        "Rồi, hít sâu. Nhìn lại đi.",
        "Không phải, nhưng vẫn sửa được.",
      ],
    },
    close: {
      plain: ["Sát quá. Sao lúc nào cũng sát vậy?"],
      flavor: [
        "Gần rồi. Thế còn tệ hơn.",
        "Có cái tốt hơn, tôi thề.",
        "Sát nút. Thần kinh tôi không chịu nổi 'sát nút'.",
      ],
    },
    answer: {
      plain: ["Rồi, đừng hoảng. Đây là đáp án."],
      flavor: [
        "Đây. Đừng bao giờ nhắc lại chuyện này.",
        "Nhanh, trước khi nó biến mất!",
        "Phù. Rồi. Nó hoạt động thế này.",
      ],
    },
    streak: {
      plain: ["Ba câu liên tiếp? Bạn là AI vậy?"],
      flavor: [
        "Dừng, dừng, tôi không chịu nổi chuỗi này!",
        "Ba! Tôi phải ngồi xuống.",
      ],
    },
    comeback: {
      plain: ["Bạn trở lại rồi. Sau CÁI ĐÓ."],
      flavor: [
        "Sửa xong. Không bao giờ nghi ngờ bạn nữa. Cho đến lần sau.",
        "Phù. Tưởng câu đó hạ gục ta rồi.",
      ],
    },
    last: {
      plain: ["Xong rồi. Ta làm được."],
      flavor: ["Tôi phải nằm xuống.", "Câu cuối. Đầu gối tôi mềm nhũn."],
    },
    perfect: {
      plain: ["Hoàn hảo. HOÀN HẢO. Tôi phải ngồi xuống."],
      flavor: ["Không gì nổ cả. Không một lần.", "Tất cả? Tôi sắp xỉu."],
    },
  },
}
