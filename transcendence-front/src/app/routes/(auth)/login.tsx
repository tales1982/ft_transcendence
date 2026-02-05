import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { login } from "../../../lib/api/auth";
import { useAppDispatch } from "../../../store/hooks";
import { setCredentials } from "../../../store/slices/auth.slice";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      dispatch(setCredentials(res));
      setSuccess(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("auth.loginError");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>{t("auth.login")}</h2>

      {success ? (
        <div style={{ color: "#4ade80", padding: "20px 0", textAlign: "center" }}>
          ✓ {t("auth.loginSuccess")}
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            {t("auth.email")}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            {t("auth.password")}
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div style={{ color: "#ff5c7a" }}>{error}</div>}

          <Button disabled={loading}>
            {loading ? t("auth.loading") : t("auth.submit")}
          </Button>
        </form>
      )}
    </Card>
  );
}
