import { Link, useRouterState } from "@tanstack/react-router";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";

const Aside = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 256px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space(3)};
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: transform 300ms ease;

  @media (max-width: 768px) {
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space(5)};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(0.5)};
  flex: 1;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space(1.5)};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 150ms ease;
  font-size: 0.925rem;
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      border-left: 3px solid ${theme.colors.primary};
      background: rgba(52, 211, 153, 0.08);
      color: ${theme.colors.text};
    `}
`;

const NavIcon = styled.span`
  width: 20px;
  margin-right: ${({ theme }) => theme.space(1.5)};
  text-align: center;
  font-size: 0.9rem;
`;

const NavBadge = styled.span`
  margin-left: auto;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  font-size: 0.7rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BottomSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.space(2)};
  text-align: center;
`;

const SchoolName = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.space(0.5)};
`;

const Authors = styled.p`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const NewTaskButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space(1.5)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 150ms ease;
  font-size: 0.95rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadow.glow};
  }
`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNewTask: () => void;
}

export function Sidebar({ open, onClose, onNewTask }: SidebarProps) {
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);

  const isActive = (path: string) => location.pathname === path;

  const handleClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <Aside $open={open}>
      <Logo>{t("app.title")}</Logo>

      <Nav>
        <NavLink to="/marketplace" $active={isActive("/marketplace")} onClick={handleClick}>
          <NavIcon>&#9750;</NavIcon>
          {t("nav.marketplace")}
        </NavLink>

        <NavLink to="/my-tasks" $active={isActive("/my-tasks")} onClick={handleClick}>
          <NavIcon>&#9776;</NavIcon>
          {t("nav.myTasks")}
        </NavLink>

        <NavLink to="/taken" $active={isActive("/taken")} onClick={handleClick}>
          <NavIcon>&#10003;</NavIcon>
          {t("nav.takenByMe")}
        </NavLink>

        <NavLink to="/chat" $active={isActive("/chat")} onClick={handleClick}>
          <NavIcon>&#9993;</NavIcon>
          {t("nav.chat")}
          {unreadCount > 0 && <NavBadge>{unreadCount}</NavBadge>}
        </NavLink>

        <NavLink to="/profile" $active={isActive("/profile")} onClick={handleClick}>
          <NavIcon>&#9787;</NavIcon>
          {t("nav.profile")}
        </NavLink>
      </Nav>

      <BottomSection>
        <NewTaskButton onClick={onNewTask}>
          + {t("tasks.newTask")}
        </NewTaskButton>

        <Footer>
          <SchoolName>42 Luxembourg</SchoolName>
          <Authors>Tales &middot; Joao &middot; Andre &middot; Sandro &middot; Fabio</Authors>
        </Footer>
      </BottomSection>
    </Aside>
  );
}
