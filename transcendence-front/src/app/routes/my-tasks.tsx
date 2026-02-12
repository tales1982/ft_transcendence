import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyCreatedTasks } from "../../store/slices/tasks.slice";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loading";
import { submissionApi } from "../../lib/api";
import { showToast } from "../../components/ui/Toast";
import type { TaskResponse, TaskSubmissionResponse } from "../../types";

export const Route = createFileRoute("/my-tasks")({
  component: MyTasksPage,
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
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.space(1.5)};
`;

const ProofBox = styled.div`
  padding: ${({ theme }) => theme.space(1.5)};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const ProofLabel = styled.h5`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  margin-bottom: 4px;
`;

const ProofText = styled.p`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(1.5)};
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

const PaidBox = styled.div`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

function MyTasksPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { myCreatedTasks, loading } = useAppSelector((s) => s.tasks);
  const [submissions, setSubmissions] = useState<Record<number, TaskSubmissionResponse[]>>({});

  useEffect(() => {
    dispatch(fetchMyCreatedTasks({ page: 0, size: 50 }));
  }, [dispatch]);

  useEffect(() => {
    myCreatedTasks
      .filter((t) => t.status === "SUBMITTED")
      .forEach(async (task) => {
        try {
          const subs = await submissionApi.getTaskSubmissions(task.id);
          setSubmissions((prev) => ({ ...prev, [task.id]: subs }));
        } catch { /* ignore */ }
      });
  }, [myCreatedTasks]);

  async function handleApprove(task: TaskResponse) {
    const taskSubs = submissions[task.id];
    const pending = taskSubs?.find((s) => s.status === "SUBMITTED");
    if (!pending) return;
    try {
      await submissionApi.approveSubmission(pending.id);
      showToast(t("tasks.approved", { amount: task.rewardAmount }));
      dispatch(fetchMyCreatedTasks({ page: 0, size: 50 }));
    } catch {
      showToast(t("tasks.approveError"), "error");
    }
  }

  async function handleReject(task: TaskResponse) {
    const taskSubs = submissions[task.id];
    const pending = taskSubs?.find((s) => s.status === "SUBMITTED");
    if (!pending) return;
    try {
      await submissionApi.rejectSubmission(pending.id);
      showToast(t("tasks.rejected"));
      dispatch(fetchMyCreatedTasks({ page: 0, size: 50 }));
    } catch {
      showToast(t("tasks.rejectError"), "error");
    }
  }

  function renderActions(task: TaskResponse) {
    switch (task.status) {
      case "OPEN":
        return (
          <Button $variant="secondary" $size="sm">
            {t("common.delete")}
          </Button>
        );
      case "IN_PROGRESS":
        return (
          <>
            <InfoText>
              {t("tasks.takenBy")}: <strong>{task.takenByEmail}</strong>
            </InfoText>
            <Button $variant="secondary" $size="sm">
              {t("tasks.openChat")}
            </Button>
          </>
        );
      case "SUBMITTED": {
        const taskSubs = submissions[task.id];
        const pending = taskSubs?.find((s) => s.status === "SUBMITTED");
        return (
          <>
            {pending && (
              <ProofBox>
                <ProofLabel>{t("tasks.proofSubmitted")}:</ProofLabel>
                <ProofText>{pending.proofText || t("tasks.noProof")}</ProofText>
              </ProofBox>
            )}
            <ActionRow>
              <Button $size="sm" onClick={() => handleApprove(task)} style={{ flex: 1 }}>
                {t("tasks.approve")} ({task.rewardAmount} ZION)
              </Button>
              <Button $variant="secondary" $size="sm" onClick={() => handleReject(task)} style={{ flex: 1 }}>
                {t("tasks.reject")}
              </Button>
            </ActionRow>
          </>
        );
      }
      case "APPROVED":
        return <PaidBox>{t("tasks.paid")}: {task.rewardAmount} ZION</PaidBox>;
      default:
        return null;
    }
  }

  return (
    <>
      <Title>{t("nav.myTasks")}</Title>

      {loading ? (
        <CenterLoader><Spinner $size="lg" /></CenterLoader>
      ) : myCreatedTasks.length === 0 ? (
        <EmptyState>{t("tasks.noTasks")}</EmptyState>
      ) : (
        <List>
          {myCreatedTasks.map((task) => (
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

              {renderActions(task)}
            </TaskItem>
          ))}
        </List>
      )}
    </>
  );
}
