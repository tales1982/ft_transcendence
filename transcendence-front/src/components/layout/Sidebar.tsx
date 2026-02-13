import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";
import  { NavLink } from "./NavBar.styled";
import  { Aside, Logo, Nav, NavIcon, NavBadge, BottomSection, NewTaskButton, Footer, SchoolName, Authors } from "./Sidebar.styled";



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
        <NavLink to="/" $active={isActive("/")} onClick={handleClick}>
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
