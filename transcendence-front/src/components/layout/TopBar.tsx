import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";

const Header = styled.header`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space(2)};
  z-index: 30;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 320px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space(1.5)};
  padding-left: 36px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: all 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 183, 96, 0.2);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`;

const WalletBtn = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  background: ${({ theme, $connected }) =>
    $connected ? "rgba(74, 183, 96, 0.15)" : theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 150ms ease;
  font-size: 0.875rem;

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

const BalanceBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
`;

const CoinIcon = styled.span`
  color: ${({ theme }) => theme.colors.warning};
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space(1)};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LangBtns = styled.div`
  display: flex;
  gap: 4px;
`;

const LangBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.bg : theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

interface TopBarProps {
  onMenuToggle: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TopBar({ onMenuToggle, searchValue, onSearchChange }: TopBarProps) {
  const { t, i18n } = useTranslation();
  const account = useAppSelector((s) => s.payment.account);
  const [walletConnected, setWalletConnected] = useState(false);

  const balance = account?.availableBalance ?? 0;

  return (
    <Header>
      <Row>
        <MobileMenuBtn onClick={onMenuToggle}>&#9776;</MobileMenuBtn>

        <SearchWrapper>
          <SearchIcon>&#128269;</SearchIcon>
          <SearchInput
            type="text"
            placeholder={t("tasks.searchPlaceholder")}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchWrapper>

        <Actions>
          <LangBtns>
            <LangBtn $active={i18n.language === "pt"} onClick={() => i18n.changeLanguage("pt")}>PT</LangBtn>
            <LangBtn $active={i18n.language === "en"} onClick={() => i18n.changeLanguage("en")}>EN</LangBtn>
            <LangBtn $active={i18n.language === "fr"} onClick={() => i18n.changeLanguage("fr")}>FR</LangBtn>
          </LangBtns>

          <WalletBtn
            $connected={walletConnected}
            onClick={() => setWalletConnected(!walletConnected)}
          >
            {walletConnected ? t("wallet.disconnect") : t("wallet.connect")}
          </WalletBtn>

          <BalanceBox>
            <CoinIcon>&#9733;</CoinIcon>
            {t("wallet.balance")}: {balance} ZION
          </BalanceBox>
        </Actions>
      </Row>
    </Header>
  );
}
