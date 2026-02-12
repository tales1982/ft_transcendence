import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Input, Label, FormGroup } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { login } from "../../../lib/api/auth";
import { useAppDispatch } from "../../../store/hooks";
import { setCredentials } from "../../../store/slices/auth.slice";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.colors.bg};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(4)};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space(4)};
`;

const Logo = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.space(0.5)};
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2.5)};
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  text-align: center;
`;

const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.space(2.5)} 0;
  text-align: center;
  font-size: 0.95rem;
`;

const BottomText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.space(2)};
`;

const AccentLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;

const LangRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const LangBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.bg : theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
`;

function LoginPage() {
  const { t, i18n } = useTranslation();
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
    <PageWrapper>
      <LoginCard>
        <LangRow>
          <LangBtn $active={i18n.language === "pt"} onClick={() => i18n.changeLanguage("pt")}>PT</LangBtn>
          <LangBtn $active={i18n.language === "en"} onClick={() => i18n.changeLanguage("en")}>EN</LangBtn>
          <LangBtn $active={i18n.language === "fr"} onClick={() => i18n.changeLanguage("fr")}>FR</LangBtn>
        </LangRow>

        <LogoSection>
          <Logo>{t("app.title")}</Logo>
          <Subtitle>{t("app.subtitle")}</Subtitle>
        </LogoSection>

        {success ? (
          <SuccessMsg>{t("auth.loginSuccess")}</SuccessMsg>
        ) : (
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label>{t("auth.email")}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("auth.password")}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </FormGroup>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Button $fullWidth disabled={loading}>
              {loading ? t("auth.loading") : t("auth.login")}
            </Button>
          </Form>
        )}

        <BottomText>
          {t("auth.noAccount")}{" "}
          <AccentLink to="/register">{t("auth.createAccount")}</AccentLink>
        </BottomText>
      </LoginCard>
    </PageWrapper>
  );
}
