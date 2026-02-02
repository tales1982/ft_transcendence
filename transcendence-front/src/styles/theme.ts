export const theme = {
  colors: {
    bg: "#0b1220",
    panel: "#121b2e",
    text: "#e8eefc",
    muted: "#9bb0d3",
    primary: "#4f7cff",
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
