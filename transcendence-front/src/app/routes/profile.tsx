import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Input, Label, FormGroup } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loading";
import { profileApi } from "../../lib/api";
import { showToast } from "../../components/ui/Toast";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/auth.slice";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(3)};
  max-width: 640px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const InfoBox = styled.div`
  margin-top: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const InfoText = styled.p`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.space(3)};
`;

const CenterLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space(6)};
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`;

function ProfilePage() {
  const { t } = useTranslation();
  const authUser = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await profileApi.getMyProfile();
        setFullName(profile.fullName || "");
        setCountry(profile.country || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
      } catch { /* new user, no profile yet */ }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.updateProfile({
        fullName: fullName || undefined,
        country,
        phone: phone || undefined,
        address: address || undefined,
      });
      showToast(t("profile.saved"));
    } catch {
      showToast(t("profile.saveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate({ to: "/login" });
  }

  if (loading) {
    return <CenterLoader><Spinner $size="lg" /></CenterLoader>;
  }

  return (
    <>
      <Title>{t("nav.profile")}</Title>

      <FormCard>
        <form onSubmit={handleSubmit}>
          <Grid>
            <FormGroup>
              <Label>{t("profile.fullName")}</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("profile.email")}</Label>
              <Input
                value={authUser?.email || ""}
                readOnly
                style={{ opacity: 0.6 }}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("profile.country")} <Required>*</Required></Label>
              <StyledSelect
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">{t("profile.selectCountry")}</option>
                <option value="BR">Brasil</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="PT">Portugal</option>
              </StyledSelect>
            </FormGroup>

            <FormGroup>
              <Label>{t("profile.phone")}</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>

            <FullWidth>
              <FormGroup>
                <Label>{t("profile.address")}</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormGroup>
            </FullWidth>
          </Grid>

          <InfoBox>
            <InfoText>{t("profile.infoNote")}</InfoText>
          </InfoBox>

          <Footer>
            <Button type="submit" disabled={saving}>
              {saving ? t("common.loading") : t("profile.save")}
            </Button>
            <Button type="button" $variant="danger" onClick={handleLogout}>
              {t("nav.logout")}
            </Button>
          </Footer>
        </form>
      </FormCard>
    </>
  );
}
