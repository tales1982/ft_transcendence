import styled, { css } from "styled-components";

interface ButtonProps {
  $variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transition.fast};

  /* Size variants */
  ${({ $size = "md", theme }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: ${theme.space(1)} ${theme.space(1.5)};
          font-size: 0.875rem;
        `;
      case "lg":
        return css`
          padding: ${theme.space(2)} ${theme.space(3)};
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: ${theme.space(1.5)} ${theme.space(2)};
          font-size: 1rem;
        `;
    }
  }}

  /* Full width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Color variants */
  ${({ $variant = "primary", theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background: ${theme.colors.card};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          &:hover:not(:disabled) {
            background: ${theme.colors.cardHover};
            border-color: ${theme.colors.borderHover};
          }
        `;
      case "outline":
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: ${theme.colors.bg};
          }
        `;
      case "danger":
        return css`
          background: ${theme.colors.danger};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.danger};
          &:hover:not(:disabled) {
            background: #c0392b;
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: ${theme.colors.textSecondary};
          border: none;
          &:hover:not(:disabled) {
            background: ${theme.colors.card};
            color: ${theme.colors.text};
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.bg};
          border: 1px solid ${theme.colors.primary};
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
            box-shadow: ${theme.shadow.glow};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 183, 96, 0.3);
  }
`;
