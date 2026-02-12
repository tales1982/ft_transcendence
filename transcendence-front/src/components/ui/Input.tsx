import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space(1.5)};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
