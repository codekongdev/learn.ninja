# Bento rehearsal

Written 2026-11-01 for `bento.tsx`, built with the stageshow skill (see `components/stage/README.md`), filmed on the real home page at `localhost:3000` with the skill's `film.mjs` (the playground has no copy of it: two of the tiles draw the player's own visuals, which only the web app can render).

## The gold

`bento` for the set (hero and strip, one window, each picture its own Stage pinned to its tile, one beat per tile once in view, 110ms apart) and `dark-bento` for the look (depth from a lighter surface, one lit color). The tile plan:

| Tile     | Span  | Kind       | The one thing                                                         | Moves                               |
| -------- | ----- | ---------- | --------------------------------------------------------------------- | ----------------------------------- |
| Kata     | 2 × 1 | Hero UI    | a word chip lands in the gap, Check turns it green, the sensei cheers | the chip flies, the tray goes green |
| Agents   | 1 × 1 | Collection | agent and chat-app marks, off the right and bottom                    | the marks settle in                 |
| Subjects | 1 × 1 | Collection | real lesson drawings on cards, off the right and bottom               | the cards settle in                 |
| Streak   | 1 × 1 | Stat       | today's lantern lights, 11 becomes 12                                 | the lantern lights, the count rolls |

Across and down, no kind sits next to itself; the kata card is the only window. The pillars Colin named (interactive, any tool, any subject, any language, gamification) are the four tiles; "any language" is a card in the subjects tile (an Arabic question, right to left) rather than a tile of its own, and "free" stays in the hero's subhead. The ninja appears once, in the kata's feedback.

## What changed from the gold

- The grid is wider than the page's text column (984, the gold's width, in a 1032 section) while the heading keeps the column, so the pictures leave the text's bounds; below 1032 the grid is the column's width, and below 640 it stacks. At the wide width the agent marks run five columns and the subject cards grow to 210, so both still run past their tile's edge.
- Each tile carries its lead alone ("One screen at a time."); the continuation is read only by assistive tech.
- The tiles are the site's cards (`bg-card`, `rounded-xl`, a foreground ring) rather than the gold's light gray tiles, and the copy is the site's type (`text-base sm:text-lg`, a semibold lead and a muted continuation).
- The grid lives in `bento.css` with container queries (stacked below 640, hero and strip above), not Tailwind's container variants, which didn't apply.
- The kata hero has two designs in the HTML and CSS picks one at 420px of tile width: the desktop lesson card (inset 24 left, 12 top, off the right by 60, the tray along its foot a gutter above the edge) and the phone player (the screen is the stage: header, kata, the tray that takes the answer's green). Both play the same script with their own cursor (arrow, touch), so a phone never sees the desktop card first.
- The subjects tile's drawings are the player's own (chess, map, chart, molecule), drawn once by `npm run bento -w web` into `bento-visuals.generated.json`, so the page ships none of the map data or chess pieces. The Arabic card is page markup.
- The streak tile is type and the player's `Lantern`, no stage: the count is the kit's `Count`, lit on scroll-in.

## Simplifications to know about

- The desktop tray has only the Check pill; the real tray's Sensei, text size and sound controls would be cut by the crop, so they're left out rather than sliced.
- The sensei's line sits beside him in the card's lower-left, not above him as the player draws it: the card is 264 tall and the bubble needs the room.
- The chips' number keys stay in the chips after checking (faded out), as the player keeps their room; the flyer carries a hidden key for the same reason, so it leaves and lands at one size.
- The word's comma sits 6px from the chip (the player's 2px reads as touching on film).

## Filmed

`spikes/stageshow/shots/bento/`: `loop-1280.png` and `loop-390.png` (14 frames at 500ms, the whole once-story of each design), `still-1280.png`, `still-390.png`.

Gate lines that stand:

- `kit override: .ss-phone…` on every stage: the hero demo's `hero-demo.css` restyles the kit's phone parts page-wide; not this component's, and present before it.
- `appears with no entrance` / `vanishes with no exit` on the flyer and the placed word: the `Fly` handoff, which the skill lists for manual review. Watched at 50ms: the flyer takes the chip's surface as it lifts and the real word shows the frame it lands.
- `data-ss-verification-stage` hydration warning: film's own attribute, added before React hydrates.

## Not checked

- The loop in Safari and on a real phone (touch, not emulated).
- Reduced motion on the real page (the poster is the checked state; `useInView` reports seen at once under reduced motion, so the marks, cards and lantern show settled).
- Light mode: production forces dark, and the stage's look is dark fixed values; the tiles outside the stage use theme tokens and would follow a light page.
- Bundle weight of the generated visuals (117KB of JSON before gzip, most of it the map's outlines at one decimal).
