import { useState, type PropsWithChildren } from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NewTaskModal } from "../features/tasks/NewTaskModal";

const Layout = styled.div`
  min-height: 100vh;
`;

const MainArea = styled.main`
  margin-left: 256px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space(3)};
  flex: 1;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space(2)};
  }
`;

const Overlay = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30;

  @media (min-width: 769px) {
    display: none;
  }
`;

export function AppShell({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Layout>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewTask={() => setNewTaskOpen(true)}
      />

      <Overlay $visible={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <MainArea>
        <TopBar
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          searchValue={search}
          onSearchChange={setSearch}
        />
        <Content>{children}</Content>
      </MainArea>

      <NewTaskModal open={newTaskOpen} onClose={() => setNewTaskOpen(false)} />
    </Layout>
  );
}
