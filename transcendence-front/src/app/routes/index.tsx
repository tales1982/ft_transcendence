import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao Transcendence!</p>
      <p>teste ola caraio</p>
    </div>
  );
}
