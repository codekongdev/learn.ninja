---
title: Quick start
description: Make, play, change, and share your first lesson in a few minutes.
---

## 1. Ask for a lesson

With the skill [installed](/docs/install), give your agent something to teach:

```text
Make me a lesson from this article: https://…
```

```text
Teach me the difference between map and forEach in JavaScript
```

```text
Turn our PRD template into a lesson for new PMs
```

The agent picks the one idea worth teaching, writes the lesson, checks it against the [lesson format](/docs/lessons/lesson-format), fixes anything the checker reports, and publishes it.

## 2. Open the link

The agent replies with a link:

```text
https://learn.ninja/l/javascript-map-vs-foreach-k3x9a2mq
```

Open it on any device. There's nothing to install and no account.

## 3. Change it

Ask for changes in plain words:

```text
Make it harder
```

```text
Add a question about chaining
```

The agent edits the same lesson file and publishes again. **The link stays the same.** The agent keeps a private edit token in `.learn/state.json` in your project; don't delete or share that file.

Want a separate copy instead? Ask for "a new link".

## 4. Share it

Send the link to anyone. Links last 24 hours for now.
