---
name: languages
description: Learning a foreign language, from vocabulary and phrases to grammar and when to use each. Use when the lesson teaches a language other than the one it's written in.
examples: spanish-greetings
version: 1.0.0
---

# Languages

Extra guidance for lessons that teach a language. It adds to `reference/teaching-guide.md`; where they disagree, the teaching guide wins.

## 1. One thing the learner can say or understand

- Teach something useful in a real situation: "Greet someone formally and informally", "Order a coffee", "Say where something is with _estar_". Not "Spanish verbs".
- Write the `objective` as a can-do statement: "Introduce yourself and ask someone's name".
- **At most 5–8 new words or phrases** per lesson. Fewer, practised well, beats a long list.
- Set `language` to the learner's language (the one you teach _in_) and `targetLanguage` to the one being learned, with a region when the variety matters (`es-MX`, `pt-PT`). Mark every target-language phrase with `lang`, as the teaching guide's Languages section describes.

## 2. Hook

Ask the learner to guess before you teach: what a phrase probably means from its context, or which of two phrasings a native speaker would really say (a `compare`). A good hook exposes an assumption carried over from the learner's own language.

## 3. Concepts: meaning in context first

- **Introduce phrases in a tiny situation**, not as a word list: two lines of dialogue, a sign, a message. Then give the meaning and when to use it.
- **Translate meaning, not words.** Give a natural translation; add "literally: …" only when the literal version helps it stick.
- **Say when to use it:** formal or informal, spoken or written, and where (Spain or Mexico, Brazil or Portugal) when it differs.
- **Grammar: examples first, then the rule.** Show two or three examples, let the pattern show, then state the rule in one sentence. A small HTML `table` works well for endings or conjugations.
- **No audio in v1.** Don't teach sounds that need hearing. A short respelling ("ñ sounds like the _ny_ in canyon") is fine; use IPA only for learners who know it.
- **Non-Latin scripts:** for beginners, add a romanisation in parentheses the first time a word appears, e.g. こんにちは (konnichiwa). Leave it out of a brick that tests reading the script.

## 4. Practice: recognise, then produce

Move from understanding to producing, and practise both directions (target → own language and own language → target):

1. **Recognise:** what does this phrase mean? (`choice`, `match`)
2. **Recall with support:** the missing word, ending, or article (`blank` with chips)
3. **Produce:** build the sentence (`order` with word chips)
4. **Use it:** what would you say here? (`scenario`, `compare`)

How the question bricks fit languages:

| Type       | Natural for…                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match`    | Words or phrases and their meanings (set `leftLang` / `rightLang`)                                                                                            |
| `blank`    | The right form: a conjugated verb, an article, an ending, a particle. Use `strictAccents` when accents change the meaning (_si_ and _sí_)                     |
| `order`    | Building a sentence from word chips, when word order is the point: questions, adjective position, verb-second. Use `alsoAccept` for every other correct order |
| `choice`   | Meaning, the right form, which phrase fits a situation                                                                                                        |
| `compare`  | Two phrasings: which sounds natural, or is polite enough, for this situation                                                                                  |
| `scenario` | Social situations where register matters; `okay` for understandable but unnatural                                                                             |
| `sort`     | Formal or informal, masculine or feminine, past or present                                                                                                    |
| `hotspot`  | Finding the mistake in a short message: one `data-hotspot` span per word or phrase                                                                            |

## 5. Wrong options from real learner errors

Build every wrong option, chip, and feedback from a mistake learners really make, and name it in the feedback:

- **Literal translation** from the learner's own language: _soy 20 años_ for "I'm 20", where Spanish says _tengo 20 años_ ("I have 20 years").
- **False friends:** _embarazada_ means pregnant, not embarrassed.
- **Agreement:** gender and number on articles and adjectives.
- **Register:** _tú_ with someone you should address as _usted_; a casual greeting in a formal email.
- **Word order** carried over from the learner's language.
- **Near-misses in form:** the wrong person or tense of the right verb.

## 6. Accuracy and naturalness

- **Use phrases people really say today.** Avoid textbook phrasings natives never use, unless the lesson is about them.
- **Check that every "wrong" option really is wrong.** Many phrases have several correct versions, and a form that's wrong in one region can be normal in another. If a variant is acceptable, accept it (`accept`, `alsoAccept`) or say which variety the lesson teaches.
- Get the details right: accents and diacritics, capitalisation (German nouns), and punctuation (¿ ¡ in Spanish, « » in French).
- **Right-to-left target languages** (Arabic, Hebrew, Persian): mark them with `lang` so the player sets the direction, and keep each chip in one language.
