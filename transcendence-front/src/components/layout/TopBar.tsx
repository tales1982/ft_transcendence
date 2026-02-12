import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/auth.slice";

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
    box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
`;

const WalletBtn = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  background: ${({ theme, $connected }) =>
    $connected ? "rgba(52, 211, 153, 0.15)" : theme.colors.card};
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

/* ── Language Select ── */

const LangWrapper = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

const LangDropdown = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "block" : "none")};
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;
  z-index: 50;
`;

const LangOption = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(2)}`};
  background: ${({ $active }) =>
    $active ? "rgba(52, 211, 153, 0.1)" : "transparent"};
  border: none;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
  transition: background 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
  }
`;

const Flag = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

const ChevronDown = styled.span`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.colors.muted};
`;

/* ── Logout Button ── */

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
  }
`;

/* ── Language data ── */

const LANGUAGES = [
  { code: "pt", label: "Português", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "fr", label: "Français", flag: "\u{1F1EB}\u{1F1F7}" },
] as const;

/* ── Component ── */

interface TopBarProps {
  onMenuToggle: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TopBar({ onMenuToggle, searchValue, onSearchChange }: TopBarProps) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const account = useAppSelector((s) => s.payment.account);
  const [walletConnected, setWalletConnected] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const balance = account?.availableBalance ?? 0;
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate({ to: "/login" });
  };

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
          <LangWrapper ref={langRef}>
            <LangButton onClick={() => setLangOpen((o) => !o)}>
              <Flag>{currentLang.flag}</Flag>
              {currentLang.code.toUpperCase()}
              <ChevronDown>&#9660;</ChevronDown>
            </LangButton>

            <LangDropdown $open={langOpen}>
              {LANGUAGES.map((lang) => (
                <LangOption
                  key={lang.code}
                  $active={i18n.language === lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <Flag>{lang.flag}</Flag>
                  {lang.label}
                </LangOption>
              ))}
            </LangDropdown>
          </LangWrapper>

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

          <LogoutBtn onClick={handleLogout}>
            &#9211; {t("nav.logout")}
          </LogoutBtn>
        </Actions>
      </Row>
    </Header>
  );
}
