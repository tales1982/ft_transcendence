import styled, { css } from "styled-components";

interface AvatarProps {
  $size?: "sm" | "md" | "lg" | "xl";
  $status?: "online" | "offline" | "away";
}

export const Avatar = styled.div<AvatarProps>`
  position: relative;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.card};
  border: 2px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  /* Size variants */
  ${({ $size = "md" }) => {
    switch ($size) {
      case "sm":
        return css`
          width: 32px;
          height: 32px;
          font-size: 0.75rem;
        `;
      case "lg":
        return css`
          width: 56px;
          height: 56px;
          font-size: 1.25rem;
        `;
      case "xl":
        return css`
          width: 80px;
          height: 80px;
          font-size: 1.75rem;
        `;
      default:
        return css`
          width: 40px;
          height: 40px;
          font-size: 1rem;
        `;
    }
  }}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Status indicator */
  ${({ $status, theme }) =>
    $status &&
    css`
      &::after {
        content: "";
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid ${theme.colors.bg};
        background: ${$status === "online"
          ? theme.colors.success
          : $status === "away"
          ? theme.colors.warning
          : theme.colors.muted};
      }
    `}
`;

export const AvatarGroup = styled.div`
  display: flex;

  ${Avatar} {
    margin-left: -8px;
    border: 2px solid ${({ theme }) => theme.colors.bg};

    &:first-child {
      margin-left: 0;
    }
  }
`;
