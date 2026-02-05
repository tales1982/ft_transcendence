import styled from "styled-components";

export const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space(1.5)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
