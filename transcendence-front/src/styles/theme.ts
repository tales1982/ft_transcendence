export const theme = {
  colors: {
    bg: "#0b1220",
    panel: "#000f07af",
    text: "#ffffff",
    muted: "#9bb0d3",
    primary: "#1DF47B",
    border: "rgba(255,255,255,0.10)",
    danger: "#ff5c7a"
  },
  gradients: {
    green:
      "linear-gradient(to right, #0A6E38 0%, #021309 57.37%, #001E0E 100%)",
  },
  radius: {
    md: "14px",
    lg: "18px",
  },
  space: (n: number) => `${n * 8}px`,
} as const;

export type AppTheme = typeof theme;


