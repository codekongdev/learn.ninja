import type { PartialVoices } from "../../voices"

// ko: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const ko: PartialVoices = {
  default: {
    praise: {
      plain: ["바로 그거예요"],
      flavor: [
        "잘했어요",
        "정확해요",
        "맞혔어요",
        "딱 맞아요",
        "그게 정답이에요",
        "잘 찾았어요",
        "훌륭해요",
      ],
    },
    correctWithHint: {
      plain: ["정답, 힌트 사용"],
      flavor: [
        "힌트 덕분에 맞혔어요",
        "힌트를 쓰고 답을 찾았어요",
        "잘 풀어냈어요",
      ],
    },
    goodGuess: {
      plain: ["좋은 추측이에요!"],
      flavor: ["감이 좋네요", "좋은 판단이에요", "예리한 추측이에요"],
    },
    hookMiss: {
      plain: ["조금 아쉽지만 괜찮아요"],
      flavor: [
        "이번엔 아니지만 괜찮아요",
        "좋은 시도예요. 이유를 알아봐요",
        "아쉬워요. 곧 이유를 알게 될 거예요",
      ],
    },
    nudge: {
      plain: ["한 번 더 살펴보세요. 찾을 수 있을 거예요."],
      flavor: [
        "조금 아쉬워요. 다시 살펴보세요.",
        "거의 다 왔어요. 다시 해 보세요.",
        "한 번만 더 보면 될 거예요.",
      ],
    },
    close: {
      plain: ["가깝지만 최선은 아니에요"],
      flavor: [
        "거의요. 더 나은 답이 있어요",
        "좋지만 최선은 아니에요",
        "가까워요. 더 잘 맞는 답이 있어요",
      ],
    },
    answer: {
      plain: ["정답은 이거예요"],
      flavor: [
        "원리는 이래요",
        "정답을 같이 봐요",
        "어려운 문제였어요. 정답은 이거예요",
      ],
    },
  },
  unhinged: {
    praise: {
      plain: ["으악! 맞았어. 진짜 맞았어"],
      flavor: [
        "세상에, 세상에, 해냈어",
        "이게 될 줄 몰랐어",
        "휴. 망한 줄 알았어",
        "맞았어. 다들 진정해",
        "눈 떨림이 멈췄어. 정답",
        "해냈는데 아무것도 안 터졌어",
        "정답. 심장이 못 버티겠어",
      ],
    },
    correctWithHint: {
      plain: ["힌트가 우리 둘을 살렸어"],
      flavor: [
        "휴, 힌트 쓰고 끝. 손이 떨려",
        "도움이 필요했고, 그래도 괜찮아",
        "힌트가 통했어. 진짜 통했어",
      ],
    },
    goodGuess: {
      plain: ["으악! 어떻게 알았어?"],
      flavor: [
        "잠깐, 그냥 알았다고?",
        "너무 정확해서 무서워",
        "어떻게? 나 지켜보고 있어?",
      ],
    },
    hookMiss: {
      plain: ["으악! 괜찮아. 완전 괜찮아"],
      flavor: [
        "틀렸지만 그냥 추측이야. 숨 쉬어",
        "아무도 못 봤어. 넘어가자",
        "걱정 마, 걱정은 내가 할게",
      ],
    },
    nudge: {
      plain: ["으악! 그거 아니야. 다시 봐"],
      flavor: [
        "어떡해, 어떡해. 한 번 더 볼래?",
        "좋아, 심호흡. 다시 보자",
        "아니지만 아직 바로잡을 수 있어",
      ],
    },
    close: {
      plain: ["아깝다. 왜 맨날 아깝지?"],
      flavor: [
        "거의. 그게 더 괴로워",
        "더 나은 게 있어, 진짜야",
        "가까워. 이런 건 내 신경이 못 버텨",
      ],
    },
    answer: {
      plain: ["오케이, 오케이, 당황하지 마. 여기 있어"],
      flavor: [
        "여기 있어. 이 얘긴 다시 하지 말자",
        "빨리, 사라지기 전에",
        "휴. 좋아. 원리는 이래",
      ],
    },
  },
}
