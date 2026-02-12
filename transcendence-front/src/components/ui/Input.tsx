import styled, { css } from "styled-components";

interface InputProps {
  $hasError?: boolean;
  $size?: "sm" | "md" | "lg";
}

export const Input = styled.input<InputProps>`
  width: 100%;
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.border};
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.fast};

  /* Size variants */
  ${({ $size = "md", theme }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: ${theme.space(1)};
          font-size: 0.875rem;
        `;
      case "lg":
        return css`
          padding: ${theme.space(2)};
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: ${theme.space(1.5)};
          font-size: 1rem;
        `;
    }
  }}

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.borderHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? "rgba(231, 76, 60, 0.2)" : "rgba(74, 183, 96, 0.2)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
`;

export const TextArea = styled.textarea<InputProps>`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.border};
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space(1.5)};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.fast};
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.borderHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? "rgba(231, 76, 60, 0.2)" : "rgba(74, 183, 96, 0.2)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space(0.5)};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.875rem;
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space(0.5)};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.75rem;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space(2)};
`;
