import { Outlet, createRootRoute, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { ToastProvider } from "../../components/ui/Toast";
import { useAppSelector } from "../../store/hooks";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.status === "authenticated");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      navigate({ to: "/login", replace: true });
    }
  }, [isAuthenticated, isAuthPage, navigate]);

  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  return (
    <>
      {isAuthPage ? (
        <Outlet />
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
      <ToastProvider />
    </>
  );
}
