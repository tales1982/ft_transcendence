import styled, { css } from "styled-components";

interface CardProps {
  $variant?: "default" | "elevated" | "outlined" | "interactive";
  $padding?: "none" | "sm" | "md" | "lg";
}

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transition.normal};

  /* Padding variants */
  ${({ $padding = "md", theme }) => {
    switch ($padding) {
      case "none":
        return css`padding: 0;`;
      case "sm":
        return css`padding: ${theme.space(2)};`;
      case "lg":
        return css`padding: ${theme.space(4)};`;
      default:
        return css`padding: ${theme.space(3)};`;
    }
  }}

  /* Style variants */
  ${({ $variant = "default", theme }) => {
    switch ($variant) {
      case "elevated":
        return css`
          background: ${theme.colors.panel};
          border: 1px solid ${theme.colors.border};
          box-shadow: ${theme.shadow.md};
        `;
      case "outlined":
        return css`
          background: transparent;
          border: 2px solid ${theme.colors.border};
        `;
      case "interactive":
        return css`
          background: ${theme.colors.panel};
          border: 1px solid ${theme.colors.border};
          cursor: pointer;
          &:hover {
            background: ${theme.colors.card};
            border-color: ${theme.colors.borderHover};
            box-shadow: ${theme.shadow.md};
          }
        `;
      default:
        return css`
          background: ${theme.colors.panel};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space(2)};
  padding-bottom: ${({ theme }) => theme.space(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const CardDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1)};
  margin-top: ${({ theme }) => theme.space(2)};
  padding-top: ${({ theme }) => theme.space(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
