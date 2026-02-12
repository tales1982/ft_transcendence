import type { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import {  Shell, Main } from "./AppShell.styled";


export function AppShell({ children }: PropsWithChildren) {
  return (
    <Shell>
      <Navbar />
      <Main>{children}</Main>
    </Shell>
  );
}
