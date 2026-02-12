import styled, { css } from "styled-components";

interface BadgeProps {
  $variant?: "default" | "success" | "warning" | "danger" | "info";
  $size?: "sm" | "md";
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  /* Size variants */
  ${({ $size = "md", theme }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: ${theme.space(0.25)} ${theme.space(0.75)};
          font-size: 0.625rem;
        `;
      default:
        return css`
          padding: ${theme.space(0.5)} ${theme.space(1)};
          font-size: 0.75rem;
        `;
    }
  }}

  /* Color variants */
  ${({ $variant = "default", theme }) => {
    switch ($variant) {
      case "success":
        return css`
          background: rgba(74, 183, 96, 0.15);
          color: ${theme.colors.success};
          border: 1px solid rgba(74, 183, 96, 0.3);
        `;
      case "warning":
        return css`
          background: rgba(245, 166, 35, 0.15);
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 166, 35, 0.3);
        `;
      case "danger":
        return css`
          background: rgba(231, 76, 60, 0.15);
          color: ${theme.colors.danger};
          border: 1px solid rgba(231, 76, 60, 0.3);
        `;
      case "info":
        return css`
          background: rgba(99, 239, 129, 0.15);
          color: ${theme.colors.info};
          border: 1px solid rgba(99, 239, 129, 0.3);
        `;
      default:
        return css`
          background: ${theme.colors.card};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

// Status-specific badges
export const StatusBadge = styled(Badge)<{ $status: string }>`
  ${({ $status, theme }) => {
    switch ($status) {
      case "OPEN":
        return css`
          background: rgba(74, 183, 96, 0.15);
          color: ${theme.colors.success};
          border: 1px solid rgba(74, 183, 96, 0.3);
        `;
      case "IN_PROGRESS":
        return css`
          background: rgba(245, 166, 35, 0.15);
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 166, 35, 0.3);
        `;
      case "SUBMITTED":
        return css`
          background: rgba(99, 239, 129, 0.15);
          color: ${theme.colors.info};
          border: 1px solid rgba(99, 239, 129, 0.3);
        `;
      case "APPROVED":
        return css`
          background: rgba(74, 183, 96, 0.15);
          color: ${theme.colors.success};
          border: 1px solid rgba(74, 183, 96, 0.3);
        `;
      case "CANCELLED":
      case "REJECTED":
        return css`
          background: rgba(231, 76, 60, 0.15);
          color: ${theme.colors.danger};
          border: 1px solid rgba(231, 76, 60, 0.3);
        `;
      default:
        return css`
          background: ${theme.colors.card};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;
