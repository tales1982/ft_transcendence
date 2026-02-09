import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao Transcendence!</p>
    </div>
  );
}


export default DashboardPage
