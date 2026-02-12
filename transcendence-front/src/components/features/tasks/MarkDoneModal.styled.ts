import styled from "styled-components"

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

export const UploadZone = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(4)};
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const UploadText = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
`;

export const UploadSub = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  margin-top: 4px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1.5)};
  padding-top: ${({ theme }) => theme.space(2)};
`;