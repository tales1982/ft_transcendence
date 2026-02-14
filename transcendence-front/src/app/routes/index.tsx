import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { publicTaskApi } from "../../lib/api/public";
import { useAppSelector } from "../../store/hooks";
import type { TaskResponse, CategoryResponse } from "../../types";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* ── Animations ── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Navbar ── */
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space(4)};
  height: 64px;
  background: rgba(11, 26, 43, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavLogo = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
`;

const NavBtn = styled.button<{ $primary?: boolean }>`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2.5)}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 200ms ease;
  border: ${({ $primary, theme }) =>
    $primary ? "none" : `1px solid ${theme.colors.border}`};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : "transparent"};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.bg : theme.colors.text};

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.primaryHover : theme.colors.card};
    box-shadow: ${({ $primary, theme }) =>
      $primary ? theme.shadow.glow : "none"};
  }
`;

const LangSelector = styled.select`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;

  option {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ── Hero ── */
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.space(12)} ${theme.space(3)}`};
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(52, 211, 153, 0.08) 0%,
    transparent 60%
  );
`;

const HeroContent = styled.div`
  max-width: 720px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.space(3)};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.space(4)};
`;

const HeroCTA = styled.button`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(5)}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 250ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadow.glow};
    transform: translateY(-2px);
  }
`;

/* ── How it works ── */
const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.space(10)} ${theme.space(3)}`};
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space(6)};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space(4)};
`;

const StepCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all 250ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const StepIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.space(2)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(52, 211, 153, 0.1);
  border-radius: 50%;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(1)};
`;

const StepDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

/* ── Tasks Section ── */
const TasksSectionBg = styled.section`
  padding: ${({ theme }) => `${theme.space(10)} ${theme.space(3)}`};
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const TasksContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space(3)};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(3)};
  transition: all 200ms ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space(1.5)};
  gap: ${({ theme }) => theme.space(1)};
`;

const CardTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const CardDesc = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.space(2)};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space(1.5)};
`;

const CategoryBadge = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: rgba(52, 211, 153, 0.1);
  border-radius: 9999px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const RewardBadge = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const OpenBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.space(0.25)} ${theme.space(1)}`};
  background: rgba(52, 211, 153, 0.15);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  margin-bottom: ${({ theme }) => theme.space(4)};
`;

const FilterChip = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.space(0.75)} ${theme.space(2)}`};
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? "rgba(52, 211, 153, 0.15)" : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space(6)};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1rem;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space(6)};
  color: ${({ theme }) => theme.colors.muted};
`;

/* ── Task Detail Modal ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space(2)};
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(4)};
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space(2)};
  right: ${({ theme }) => theme.space(2)};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(2)};
  padding-right: ${({ theme }) => theme.space(4)};
`;

const ModalDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const ModalLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  display: block;
  margin-bottom: 4px;
`;

const ModalValue = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalReward = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ModalLoginBtn = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space(1.5)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg};
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 200ms ease;
  margin-top: ${({ theme }) => theme.space(2)};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadow.glow};
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1)};
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const TagChip = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 9999px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ── Footer ── */
const FooterSection = styled.footer`
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(3)}`};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterLogo = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space(1)};
`;

const FooterText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.space(0.5)};
`;

/* ── Helpers ── */
function formatDate(dateString?: string) {
  if (!dateString) return "\u2014";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Component ── */
function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(
    (s) => s.auth.status === "authenticated"
  );

  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/marketplace", replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function load() {
      try {
        const [taskData, catData] = await Promise.all([
          publicTaskApi.getOpenTasks(0, 50),
          publicTaskApi.getCategories(),
        ]);
        setTasks(taskData.content);
        setCategories(catData);
      } catch {
        // silently fail - tasks just won't show
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTasks = categoryFilter
    ? tasks.filter((t) => t.categoryName === categoryFilter)
    : tasks;

  const steps = [
    {
      icon: "\u270D\uFE0F",
      titleKey: "landing.step1Title",
      descKey: "landing.step1Desc",
    },
    {
      icon: "\uD83D\uDD0D",
      titleKey: "landing.step2Title",
      descKey: "landing.step2Desc",
    },
    {
      icon: "\u2705",
      titleKey: "landing.step3Title",
      descKey: "landing.step3Desc",
    },
    {
      icon: "\uD83D\uDCB0",
      titleKey: "landing.step4Title",
      descKey: "landing.step4Desc",
    },
  ];

  return (
    <div style={{ background: "#0B1A2B", minHeight: "100vh" }}>
      {/* ── Navbar ── */}
      <Nav>
        <NavLogo>Transcendence</NavLogo>
        <NavActions>
          <LangSelector
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </LangSelector>
          <NavBtn onClick={() => navigate({ to: "/login" })}>
            {t("auth.login")}
          </NavBtn>
          <NavBtn $primary onClick={() => navigate({ to: "/register" })}>
            {t("auth.register")}
          </NavBtn>
        </NavActions>
      </Nav>

      {/* ── Hero ── */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            {t("landing.heroTitle1")}{" "}
            <span>{t("landing.heroHighlight")}</span>{" "}
            {t("landing.heroTitle2")}
          </HeroTitle>
          <HeroSubtitle>{t("landing.heroSubtitle")}</HeroSubtitle>
          <HeroCTA onClick={() => navigate({ to: "/register" })}>
            {t("landing.heroCTA")}
          </HeroCTA>
        </HeroContent>
      </HeroSection>

      {/* ── How it works ── */}
      <SectionWrapper>
        <SectionTitle>
          {t("landing.howTitle1")} <span>{t("landing.howHighlight")}</span>?
        </SectionTitle>
        <StepsGrid>
          {steps.map((s, i) => (
            <StepCard key={i}>
              <StepIcon>{s.icon}</StepIcon>
              <StepTitle>{t(s.titleKey)}</StepTitle>
              <StepDesc>{t(s.descKey)}</StepDesc>
            </StepCard>
          ))}
        </StepsGrid>
      </SectionWrapper>

      {/* ── Available Tasks ── */}
      <TasksSectionBg>
        <TasksContainer>
          <SectionTitle>
            {t("landing.tasksTitle1")}{" "}
            <span>{t("landing.tasksHighlight")}</span>
          </SectionTitle>

          {categories.length > 0 && (
            <FilterRow>
              <FilterChip
                $active={categoryFilter === ""}
                onClick={() => setCategoryFilter("")}
              >
                {t("tasks.allCategories")}
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  $active={categoryFilter === c.name}
                  onClick={() => setCategoryFilter(c.name)}
                >
                  {c.name}
                </FilterChip>
              ))}
            </FilterRow>
          )}

          {loading ? (
            <LoadingWrapper>{t("common.loading")}</LoadingWrapper>
          ) : filteredTasks.length === 0 ? (
            <EmptyState>{t("tasks.noTasks")}</EmptyState>
          ) : (
            <TasksGrid>
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} onClick={() => setSelectedTask(task)}>
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                    <OpenBadge>OPEN</OpenBadge>
                  </CardHeader>
                  <CardDesc>{task.description}</CardDesc>
                  <CardMeta>
                    <CategoryBadge>
                      {task.categoryName || "\u2014"}
                    </CategoryBadge>
                    <RewardBadge>{task.rewardAmount} ZION</RewardBadge>
                  </CardMeta>
                  <CardBottom>
                    <span>{task.locationText || "Remote"}</span>
                    <span>{formatDate(task.deadlineAt)}</span>
                  </CardBottom>
                </TaskCard>
              ))}
            </TasksGrid>
          )}
        </TasksContainer>
      </TasksSectionBg>

      {/* ── Footer ── */}
      <FooterSection>
        <FooterLogo>Transcendence</FooterLogo>
        <FooterText>42 Luxembourg</FooterText>
        <FooterText>
          Tales &middot; Joao &middot; Andre &middot; Sandro &middot; Fabio
        </FooterText>
      </FooterSection>

      {/* ── Task Detail Modal ── */}
      {selectedTask && (
        <ModalOverlay onClick={() => setSelectedTask(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={() => setSelectedTask(null)}>
              &times;
            </ModalClose>
            <ModalTitle>{selectedTask.title}</ModalTitle>
            <ModalDesc>{selectedTask.description}</ModalDesc>

            <ModalGrid>
              <div>
                <ModalLabel>{t("tasks.category")}</ModalLabel>
                <CategoryBadge>
                  {selectedTask.categoryName || "\u2014"}
                </CategoryBadge>
              </div>
              <div>
                <ModalLabel>{t("tasks.reward")}</ModalLabel>
                <ModalReward>{selectedTask.rewardAmount} ZION</ModalReward>
              </div>
              <div>
                <ModalLabel>{t("tasks.location")}</ModalLabel>
                <ModalValue>
                  {selectedTask.locationText || "Remote"}
                </ModalValue>
              </div>
              <div>
                <ModalLabel>{t("tasks.deadline")}</ModalLabel>
                <ModalValue>{formatDate(selectedTask.deadlineAt)}</ModalValue>
              </div>
            </ModalGrid>

            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <TagsRow>
                {selectedTask.tags.map((tag) => (
                  <TagChip key={tag}>#{tag}</TagChip>
                ))}
              </TagsRow>
            )}

            <ModalLoginBtn onClick={() => navigate({ to: "/login" })}>
              {t("landing.loginToTake")}
            </ModalLoginBtn>
          </ModalCard>
        </ModalOverlay>
      )}
    </div>
  );
}
