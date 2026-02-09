import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AppShell } from "../../components/layout/AppShell";
import LanguagesSync from "../../components/layout/LanguagesSync";

export const Route = createRootRoute({
  component: () => (
    <>
      <LanguagesSync />
    <AppShell>
      <Outlet />
    </AppShell>
    </>
  ),
});
