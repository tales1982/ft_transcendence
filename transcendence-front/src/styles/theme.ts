export const theme = {
  colors: {
    bg: "#0b1220",
    panel: "#121b2e",
    text: "#000000",
    muted: "#9bb0d3",
    primary: "#1DF47B",
    border: "rgba(255,255,255,0.10)",
    danger: "#ff5c7a"
  },
  radius: {
    md: "14px",
    lg: "18px",
  },
  space: (n: number) => `${n * 8}px`,
} as const;

export type AppTheme = typeof theme;
