import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: ${({ theme }) => theme.gradients.green};
    color: ${({ theme }) => theme.colors.text};
  }
  a { color: inherit; text-decoration: none; }
  button, input { font: inherit; }
`;
