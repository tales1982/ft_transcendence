import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "./(app)/dashboard"
import LanguagesSync from "../../components/layout/LanguagesSync";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <LanguagesSync/>
    <DashboardPage/>
    </div>
  );
}
