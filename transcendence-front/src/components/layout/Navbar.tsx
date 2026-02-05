import { Link } from "@tanstack/react-router";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Bar = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space(2)};
`;

const Row = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(1)};
  align-items: center;
`;

const NavLink = styled(Link)`
  opacity: 0.9;
  &:hover { opacity: 1; }
`;

const LangBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 6px 10px;
  cursor: pointer;
`;

export function Navbar() {
  const { t, i18n } = useTranslation();

  return (
    <Bar>
      <Row>
        <Left>
          <strong>{t("app.title")}</strong>
          <NavLink to="/">{t("nav.dashboard")}</NavLink>
          <NavLink to="/login">{t("nav.login")}</NavLink>
          <NavLink to="/register">{t("nav.register")}</NavLink>
        </Left>

        <Right>
          <LangBtn onClick={() => i18n.changeLanguage("pt")}>PT</LangBtn>
          <LangBtn onClick={() => i18n.changeLanguage("en")}>EN</LangBtn>
          <LangBtn onClick={() => i18n.changeLanguage("fr")}>FR</LangBtn>
        </Right>
      </Row>
    </Bar>
  );
}
