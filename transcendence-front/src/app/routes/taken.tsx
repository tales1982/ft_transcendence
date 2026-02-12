import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyTakenTasks } from "../../store/slices/tasks.slice";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loading";
import { MarkDoneModal } from "../../components/features/tasks/MarkDoneModal";

export const Route = createFileRoute("/taken")({
  component: TakenByMePage,
});

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const TaskItem = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space(2.5)};
`;

const TaskTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space(1.5)};
  gap: ${({ theme }) => theme.space(1)};
`;

const TaskTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const TaskDesc = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const CategoryTag = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 9999px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RewardText = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const WaitingBox = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.space(1)};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
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

function TakenByMePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { myTakenTasks, loading } = useAppSelector((s) => s.tasks);
  const [markDoneTaskId, setMarkDoneTaskId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyTakenTasks({ page: 0, size: 50 }));
  }, [dispatch]);

  return (
    <>
      <Title>{t("nav.takenByMe")}</Title>

      {loading ? (
        <CenterLoader><Spinner $size="lg" /></CenterLoader>
      ) : myTakenTasks.length === 0 ? (
        <EmptyState>{t("tasks.noTasks")}</EmptyState>
      ) : (
        <List>
          {myTakenTasks.map((task) => (
            <TaskItem key={task.id}>
              <TaskTop>
                <TaskTitle>{task.title}</TaskTitle>
                <StatusBadge $status={task.status}>
                  {task.status.replace("_", " ")}
                </StatusBadge>
              </TaskTop>

              <TaskDesc>{task.description}</TaskDesc>

              <MetaRow>
                <CategoryTag>{task.categoryName || "—"}</CategoryTag>
                <RewardText>{task.rewardAmount} ZION</RewardText>
              </MetaRow>

              <InfoRow>
                <span>{t("tasks.creator")}: {task.creatorEmail}</span>
                <span>{t("tasks.deadline")}: {formatDate(task.deadlineAt)}</span>
              </InfoRow>

              {task.status === "IN_PROGRESS" && (
                <Button $fullWidth onClick={() => setMarkDoneTaskId(task.id)}>
                  {t("tasks.markDone")}
                </Button>
              )}

              {task.status === "SUBMITTED" && (
                <WaitingBox>{t("tasks.waitingApproval")}</WaitingBox>
              )}
            </TaskItem>
          ))}
        </List>
      )}

      <MarkDoneModal
        open={markDoneTaskId !== null}
        onClose={() => setMarkDoneTaskId(null)}
        taskId={markDoneTaskId}
        onSubmitted={() => dispatch(fetchMyTakenTasks({ page: 0, size: 50 }))}
      />
    </>
  );
}
