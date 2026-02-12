export const theme = {
  colors: {
    // Background / Dark UI (navy com leve toque verde)
    bg: "#0B1A2B",
    bgSecondary: "#112240",
    bgTertiary: "#1A3150",

    // Elements UI / Cards / Panels
    panel: "#112240",
    card: "#1A3150",
    cardHover: "#243D5C",

    // Text
    text: "#E2E8F0",
    textSecondary: "#8B9CB4",
    muted: "#8B9CB4",

    // Accent / Buttons / Highlights
    primary: "#34D399",
    primaryHover: "#6EE7B7",
    accent: "#22D3EE",

    // Borders
    border: "rgba(52, 211, 153, 0.15)",
    borderHover: "rgba(52, 211, 153, 0.30)",

    // Status colors
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#22D3EE"
  },
  radius: {
    sm: "8px",
    md: "14px",
    lg: "18px",
    xl: "24px",
  },
  space: (n: number) => `${n * 8}px`,
  shadow: {
    sm: "0 2px 4px rgba(11, 26, 43, 0.3)",
    md: "0 4px 12px rgba(11, 26, 43, 0.4)",
    lg: "0 8px 24px rgba(11, 26, 43, 0.5)",
    glow: "0 0 20px rgba(52, 211, 153, 0.25)",
  },
  transition: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "400ms ease",
  }
} as const;

export type AppTheme = typeof theme;
