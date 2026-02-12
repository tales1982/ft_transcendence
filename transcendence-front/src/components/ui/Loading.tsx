import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

interface SpinnerProps {
  $size?: "sm" | "md" | "lg";
}

export const Spinner = styled.div<SpinnerProps>`
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;

  ${({ $size = "md" }) => {
    switch ($size) {
      case "sm":
        return `
          width: 16px;
          height: 16px;
          border-width: 2px;
        `;
      case "lg":
        return `
          width: 40px;
          height: 40px;
          border-width: 4px;
        `;
      default:
        return `
          width: 24px;
          height: 24px;
        `;
    }
  }}
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(6, 21, 11, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(0.5)};

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    animation: ${pulse} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
`;

export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.card} 25%,
    ${({ theme }) => theme.colors.cardHover} 50%,
    ${({ theme }) => theme.colors.card} 75%
  );
  background-size: 200% 100%;
  animation: ${keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  `} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.radius.sm};
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "20px"};
`;
