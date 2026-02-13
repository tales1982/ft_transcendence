import styled from "styled-components";

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};
  margin: ${({ theme }) => theme.space(3)} 0;
`;

export const InfoLabel = styled.h4`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 4px;
`;

export const InfoValue = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.925rem;
`;

export const RewardValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.925rem;
  line-height: 1.6;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1)};
  margin: ${({ theme }) => theme.space(2)} 0;
`;

export const Tag = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 9999px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CreatorCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  padding: ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  margin: ${({ theme }) => theme.space(2)} 0;
`;

export const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

export const CreatorSub = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1.5)};
  padding-top: ${({ theme }) => theme.space(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;