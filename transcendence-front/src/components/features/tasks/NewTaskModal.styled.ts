import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2.5)};
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1.5)};
  padding-top: ${({ theme }) => theme.space(2)};
`;

export const SuggestionList = styled.div`
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

export const SuggestionItem = styled.div`
  padding: ${({ theme }) => theme.space(1.5)};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

export const CategoryWrapper = styled.div`
  position: relative;
`;