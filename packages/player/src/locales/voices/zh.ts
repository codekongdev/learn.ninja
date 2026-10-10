import type { PartialVoices } from "../../voices"

// zh: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const zh: PartialVoices = {
  default: {
    praise: {
      plain: ["就是这样"],
      flavor: [
        "做得好",
        "完全正确",
        "答对了",
        "一针见血",
        "正是这个",
        "眼光真准",
        "没错",
      ],
    },
    correctWithHint: {
      plain: ["正确，借助了提示"],
      flavor: ["靠提示答对了", "用了提示，找到答案", "解得漂亮"],
    },
    goodGuess: {
      plain: ["猜得不错！"],
      flavor: ["直觉很好", "判断得好", "猜得真准"],
    },
    hookMiss: {
      plain: ["不太对，没关系"],
      flavor: [
        "这次没猜中，没关系",
        "不错的尝试，来看看为什么",
        "差一点。马上你就知道原因",
      ],
    },
    nudge: {
      plain: ["再看一眼，我相信你能找到。"],
      flavor: [
        "不太对，再仔细看看。",
        "差一点，再试一次。",
        "再看一眼应该就行了。",
      ],
    },
    close: {
      plain: ["接近了，但不是最佳答案"],
      flavor: [
        "差一点，还有更好的",
        "不错，但不是最好的",
        "很接近，有个选项更合适",
      ],
    },
    answer: {
      plain: ["答案在这里"],
      flavor: ["原理是这样的", "一起来看答案", "这题有点难，答案在这里"],
    },
  },
  unhinged: {
    praise: {
      plain: ["啊！对了。居然真的对了"],
      flavor: [
        "天哪天哪，你做到了",
        "真不敢相信成功了",
        "呼，我还以为完蛋了",
        "答对了。大家别慌",
        "我眼皮不跳了。答对了",
        "你答对了，什么都没爆炸",
        "答对了。我心脏受不了",
      ],
    },
    correctWithHint: {
      plain: ["提示救了我们俩"],
      flavor: [
        "呼，靠提示搞定。我还在抖",
        "需要帮忙，这没关系",
        "提示有用。真的有用",
      ],
    },
    goodGuess: {
      plain: ["啊！你怎么知道的？"],
      flavor: [
        "等等，你就这么知道了？",
        "猜得太准了吧",
        "怎么做到的？你在盯着我吗？",
      ],
    },
    hookMiss: {
      plain: ["啊！没事。完全没事"],
      flavor: [
        "错了，但只是猜猜。深呼吸",
        "没人看见。继续",
        "别担心，我替你担心",
      ],
    },
    nudge: {
      plain: ["啊！不是那个。再看看"],
      flavor: [
        "糟了糟了。再看一眼？",
        "好，深呼吸。再看看",
        "不是它，但还来得及改",
      ],
    },
    close: {
      plain: ["好接近。为什么总是差一点？"],
      flavor: [
        "差一点。这反而更难受",
        "还有更好的，我发誓",
        "好接近。我神经受不了",
      ],
    },
    answer: {
      plain: ["好好好，别慌。答案在这"],
      flavor: [
        "答案在这。这事就别再提了",
        "快，趁它还没消失",
        "呼。好。原理是这样的",
      ],
    },
  },
}
