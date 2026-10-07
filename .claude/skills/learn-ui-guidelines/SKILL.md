---
name: learn-ui-guidelines
description: UI rules for the Learn app and lesson player. Use before building or changing any screen, component, or style in apps/web, packages/player, or packages/ui (layout, colors, dark mode, cards, buttons, typography, states, accessibility, right-to-left), and when reviewing a design or a Figma frame against the build.
---

# Learn UI guidelines

The look comes from **shadcn's Vega style** (`aria-vega` in both `components.json` files). Colin's Figma frames are wireframes: follow their layout and content, but take component looks and sizes from shadcn, not from Figma. When Figma and Vega disagree on a component's look, Vega wins; when they disagree on layout, Figma wins.

## Components first

- Use the components in `packages/ui/src/components` (button, badge, card, alert, progress, dialog, dropdown-menu, direction, selectable). If one is missing, add it with `npx shadcn@latest add <name>` from `apps/web`. Don't copy shadcn classes into new markup.
- Player code imports UI only from `@workspace/ui/components/*`, never from `react-aria-components` (the drag-and-drop module is the one exception).
- Answer options, chips, and gaps use `Selectable` (a React Aria toggle) styled with the control recipe below.

## Surfaces and elevation

Every screen has visible layers in both themes, and especially in dark mode, where nothing should sit flat on pure black.

| Layer | Use | Classes |
| --- | --- | --- |
| Page | App background, header, footer | `bg-background` |
| Card | Lesson card, Theory card, content cards | `bg-card rounded-xl shadow-xs ring-1 ring-foreground/10` (or the `Card` component) |
| Control on a card | Options, chips, drag items, filled gaps | `rounded-md border bg-background shadow-xs dark:bg-input/30`, hover `bg-muted` / `dark:bg-input/50` |
| Floating | Menus, dialogs | `bg-popover` (the components handle it) |

- Never paint a card with `bg-background`; that merges it into the page in dark mode.
- Selected controls use `border-primary` plus `bg-muted`, with `dark:data-selected:bg-muted` so the dark tint doesn't hide the selection.
- Shadows stay at `shadow-xs`. Use rings and borders for separation, not heavier shadows.

## Shapes and sizes

- Radius: `rounded-md` for controls, `rounded-lg` for alerts and inner panels, `rounded-xl` for cards, `rounded-full` only for pills, badges, progress, and avatars. No arbitrary radii.
- Borders are 1px. No `border-[1.5px]` or 3D bottom shadows.
- All buttons are `sm` (`icon-sm` for icon-only): the app frame and each screen's main action. The main action sits inline under the screen's content (not in a bottom bar) and shows an `Enter` `Kbd` hint, hidden on touch screens (`pointer-coarse:hidden`).
- One primary (filled) button per area. Everything else is `outline` or `ghost`.

## Typography

- Screens are a centered column: `max-w-sm` for the intro, `max-w-lg` for questions and concepts, `max-w-2xl` when there's a visual or a side-by-side exercise. Headings are `text-2xl font-semibold`; options and body copy in tight spaces are `text-sm font-medium`.
- Use Tailwind's text scale only (`text-xs` to `text-4xl`). No pixel or arbitrary sizes.
- Lesson content scales with the learner's text size setting: wrap it in an element with `data-text-size={textSize}`. The app frame (header, footer, buttons) never scales.
- Two weights do most of the work: `font-medium` for labels and `font-semibold`/`font-bold` for headings. Supporting text is `text-muted-foreground`, never reduced opacity.
- Sentence case everywhere.

## Color

- Use semantic tokens only (`bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`...). No raw hex or palette colors in UI chrome.
- Answer feedback colors: green for correct, yellow for a miss you can retry (the `warning` button variant, yellow marks), red only once the answer is revealed. Use tints with a matching border and a dark text shade (`text-yellow-900` on `bg-yellow-100`, not `text-yellow-600`) so text meets AA, and check both themes.
- Feedback after checking is a small toast in the lesson card's bottom start corner: one short semibold line, plus at most one short sentence. Options show their result in the number key's place (a green check or a yellow X), and the option row itself stays neutral. A correct answer gets a short praise line, a `success` Continue button, and a **Why?** button that reveals the explanation in the toast; explanations are never shown unasked except once an answer is revealed.

## Layout and direction

- Use logical utilities only (`ms-*`, `pe-*`, `start-*`, `end-*`, `text-start`). Directional icons get `rtl:-scale-x-100` or `rtl:rotate-180`.
- Content columns max out around `max-w-2xl`. Phones (375px) get edge-to-edge cards, icon-only secondary buttons, and no horizontal scroll. Grids that hold long content use `grid-cols-[minmax(0,1fr)]`.
- Wrap user handles and code in `<bdi dir="ltr">` so they stay readable in Arabic.

## States and interaction

- Every interactive element has hover, `focus-visible` (the 3px ring from the components), pressed, and selected or disabled states as needed. Prefer explaining why something can't happen over a disabled button.
- Keyboard first: Enter runs the main action (start, check, continue) and number keys pick answer options, each shown with a `Kbd` hint. Avoid pointer-only interactions.
- Motion goes behind `motion-safe:` and stays short (fades and small slides, about 150 to 300ms).

## Accessibility

- Icon-only buttons need an `aria-label`. Progress and status changes are announced (`aria-live`, `valueLabel`).
- Touch targets are at least 32px in the frame and 40px for main actions.
- Text and tinted backgrounds meet WCAG AA contrast in both themes.

## Copy

- All player text lives in `packages/player/src/strings.ts` with English and Arabic. Never hard-code UI strings in components.
- Keep it short and plain: "Check", "Try again", "Link copied". No exclamation marks in system text, except for celebrating a correct answer.

## Before calling a UI change done

1. Run `npm run check`.
2. Look at it in Storybook or the dev server in light and dark, in English and Arabic (`?ui=ar`), at 375px and at desktop width, and with text size set to Large.
3. Add or update a story for any new screen or state.
