import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Navbar } from "./Navbar";

const Shell = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const Main = styled.main`
  padding: ${({ theme }) => theme.space(3)};
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
`;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <Shell>
      <Navbar />
      <Main>{children}</Main>
    </Shell>
  );
}
