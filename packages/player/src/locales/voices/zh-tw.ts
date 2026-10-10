import type { PartialVoices } from "../../voices"

// zhTw: the Default and Unhinged lines so far; English stands in for Sensei and the earned moments
// until this language's own are written.

export const zhTw: PartialVoices = {
  default: {
    praise: {
      plain: ["就是這樣"],
      flavor: [
        "做得好",
        "完全正確",
        "答對了",
        "一針見血",
        "就是這個",
        "眼光真準",
        "沒錯",
      ],
    },
    correctWithHint: {
      plain: ["正確，使用了提示"],
      flavor: ["靠提示答對了", "用了提示，找到答案", "解得很漂亮"],
    },
    goodGuess: {
      plain: ["猜得不錯！"],
      flavor: ["直覺很好", "判斷得很好", "猜得真準"],
    },
    hookMiss: {
      plain: ["不太對，沒關係"],
      flavor: [
        "這次沒猜中，沒關係",
        "不錯的嘗試，來看看為什麼",
        "差一點。等一下就知道為什麼",
      ],
    },
    nudge: {
      plain: ["再看一眼，我相信你找得到。"],
      flavor: [
        "不太對，再仔細看看。",
        "差一點，再試一次。",
        "再看一眼應該就可以了。",
      ],
    },
    close: {
      plain: ["接近了，但不是最佳答案"],
      flavor: [
        "差一點，還有更好的",
        "不錯，但不是最好的",
        "很接近，有個選項更適合",
      ],
    },
    answer: {
      plain: ["答案在這裡"],
      flavor: ["原理是這樣的", "一起來看答案", "這題有點難，答案在這裡"],
    },
  },
  unhinged: {
    praise: {
      plain: ["啊！對了。竟然真的對了"],
      flavor: [
        "天啊天啊，你做到了",
        "不敢相信居然成功了",
        "呼，我還以為完蛋了",
        "答對了。大家不要慌",
        "我眼皮不跳了。答對了",
        "你答對了，什麼都沒爆炸",
        "答對了。我心臟受不了",
      ],
    },
    correctWithHint: {
      plain: ["提示救了我們兩個"],
      flavor: [
        "呼，靠提示搞定。我還在發抖",
        "需要幫忙，這沒關係",
        "提示有用。真的有用",
      ],
    },
    goodGuess: {
      plain: ["啊！你怎麼知道的？"],
      flavor: [
        "等等，你就這樣知道了？",
        "猜得也太準了吧",
        "怎麼會？你在監視我嗎？",
      ],
    },
    hookMiss: {
      plain: ["啊！沒事。完全沒事"],
      flavor: [
        "錯了，但只是猜猜。深呼吸",
        "沒人看到。繼續",
        "別擔心，我幫你擔心",
      ],
    },
    nudge: {
      plain: ["啊！不是那個。再看看"],
      flavor: [
        "糟了糟了。再看一眼？",
        "好，深呼吸。再看看",
        "不是它，但還來得及改",
      ],
    },
    close: {
      plain: ["好接近。為什麼老是差一點？"],
      flavor: [
        "差一點。這反而更難受",
        "還有更好的，我保證",
        "好接近。我的神經受不了",
      ],
    },
    answer: {
      plain: ["好好好，別慌。答案在這"],
      flavor: [
        "答案在這。這件事別再提了",
        "快，趁它還沒消失",
        "呼。好。原理是這樣的",
      ],
    },
  },
}
