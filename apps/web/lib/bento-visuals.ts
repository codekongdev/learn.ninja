import type { DrawableVisual } from "@workspace/player/draw"

// The pictures in the home page's bento of subjects: real lesson visuals, drawn once by
// scripts/build-bento.tsx into components/home/bento-visuals.generated.json, so the home page
// ships no map data, chess pieces, or chemistry. The test beside this file fails when they're stale.

export const BENTO_VISUALS = {
  chess: {
    kind: "chess",
    alt: "The Italian Game: White's bishop on c4 eyes f7.",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    highlight: ["f7"],
    arrows: [{ from: "c4", to: "f7" }],
  },
  map: {
    kind: "map",
    alt: "The six founders of the European Coal and Steel Community.",
    region: "europe",
    countries: [
      { code: "FR" },
      { code: "DE" },
      { code: "IT" },
      { code: "BE" },
      { code: "NL" },
      { code: "LU" },
    ],
  },
  chart: {
    kind: "chart",
    type: "function",
    alt: "Compound interest curves up past simple interest.",
    x: { label: "Years", min: 0, max: 30 },
    y: { min: 0 },
    series: [
      { expression: "1000 * 1.07^x", label: "Compound" },
      { expression: "1000 + 70x", label: "Simple" },
    ],
  },
  molecule: {
    kind: "molecule",
    alt: "Caffeine.",
    smiles: "Cn1cnc2c1c(=O)n(C)c(=O)n2C",
  },
  clock: {
    kind: "clock",
    alt: "A clock showing a quarter to four.",
    time: "3:45",
  },
} satisfies Record<string, DrawableVisual>

export type BentoVisualName = keyof typeof BENTO_VISUALS

/**
 * A map's outlines come at the full precision the player draws them at, which is more than a
 * tile needs: one decimal keeps the shapes and halves the file.
 */
export const trim = (svg: string) =>
  svg.replace(/-?\d+\.\d{2,}/g, (n) => Number(n).toFixed(1))
