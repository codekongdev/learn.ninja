/** Draws an agent's logo as a mask over the element's background color, so it takes the text color. */
export const logoMask = (logo: string): React.CSSProperties => ({
  maskImage: `url(/agents/${logo}.svg)`,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
})
