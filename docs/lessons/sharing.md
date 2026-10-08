---
title: Links and editing
description: How lesson links work, how long they last, who can see them, and how to change a lesson.
---

## Links

Each published lesson gets a link made from its title and a random id:

```text
https://learn.ninja/l/how-compound-interest-works-k3x9a2mq
```

Anyone with the link can play the lesson. The id is random, so links can't be guessed, but anyone you send it to can pass it on. Don't put private or sensitive material in a lesson.

## How long links last

Links last **24 hours** from when the lesson was first published. Updating a lesson doesn't reset the clock. When a link expires, ask your agent to publish the lesson again: it gets a new link.

## Changing a lesson

Ask your agent for the change. It edits the same lesson file and publishes again, and the link stays the same.

That works because publishing returns a private **edit token**, which the skill saves in `.learn/state.json` in your project. Only someone with the token can update the lesson. Don't delete or share that file. If it's gone, the agent can only publish a new copy with a new link.

## A separate copy

Ask for "a new link" and the agent publishes the lesson as a new copy (`learn publish lesson.json --new`). The old link keeps working until it expires.
