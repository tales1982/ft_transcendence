import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOpenTasks, fetchCategories } from "../../store/slices/tasks.slice";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Loading";
import { TaskDetailsModal } from "../../components/features/tasks/TaskDetailsModal";
import type { TaskResponse } from "../../types";

export const Route = createFileRoute("/")({
  component: MarketplacePage,
});

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space(3)};
  gap: ${({ theme }) => theme.space(2)};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1.5)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.space(3)};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(2.5)};
  transition: all 200ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const CardTop = styled.div`
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
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const CategoryTag = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 9999px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RewardText = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const FooterItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CenterLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space(6)};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space(6)};
  color: ${({ theme }) => theme.colors.muted};
`;

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MarketplacePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, categories, loading } = useAppSelector((s) => s.tasks);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    dispatch(fetchOpenTasks({ page: 0, size: 50 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredTasks = categoryFilter
    ? tasks.filter((t) => t.categoryName === categoryFilter)
    : tasks;

  function openDetails(task: TaskResponse) {
    setSelectedTask(task);
    setDetailsOpen(true);
  }

  return (
    <>
      <Header>
        <Title>{t("nav.marketplace")}</Title>
        <Filters>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">{t("tasks.allCategories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </Filters>
      </Header>

      {loading ? (
        <CenterLoader>
          <Spinner $size="lg" />
        </CenterLoader>
      ) : filteredTasks.length === 0 ? (
        <EmptyState>{t("tasks.noTasks")}</EmptyState>
      ) : (
        <Grid>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id}>
              <CardTop>
                <CardTitle>{task.title}</CardTitle>
                <StatusBadge $status={task.status}>OPEN</StatusBadge>
              </CardTop>

              <CardDesc>{task.description}</CardDesc>

              <CardMeta>
                <CategoryTag>{task.categoryName || "—"}</CategoryTag>
                <RewardText>{task.rewardAmount} ZION</RewardText>
              </CardMeta>

              <CardFooter>
                <FooterItem>{task.locationText || "Remote"}</FooterItem>
                <FooterItem>{formatDate(task.deadlineAt)}</FooterItem>
              </CardFooter>

              <Button $variant="secondary" $fullWidth onClick={() => openDetails(task)}>
                {t("tasks.viewDetails")}
              </Button>
            </TaskCard>
          ))}
        </Grid>
      )}

      <TaskDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        task={selectedTask}
        onTaken={() => dispatch(fetchOpenTasks({ page: 0, size: 50 }))}
      />
    </>
  );
}
