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
  const isPublicPage =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthenticated && !isPublicPage) {
      navigate({ to: "/login", replace: true });
    }
  }, [isAuthenticated, isPublicPage, navigate]);

  if (!isAuthenticated && !isPublicPage) {
    return null;
  }

  const showShell = isAuthenticated && !isPublicPage;

  return (
    <>
      {showShell ? (
        <AppShell>
          <Outlet />
        </AppShell>
      ) : (
        <Outlet />
      )}
      <ToastProvider />
    </>
  );
}
