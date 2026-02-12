import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { StatusBadge } from "../../ui/Badge";
import { Avatar } from "../../ui/Avatar";
import type { TaskResponse } from "../../../types";
import { taskApi } from "../../../lib/api";
import { showToast } from "../../ui/Toast";
import { useState } from "react";

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};
  margin: ${({ theme }) => theme.space(3)} 0;
`;

const InfoLabel = styled.h4`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 4px;
`;

const InfoValue = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.925rem;
`;

const RewardValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.925rem;
  line-height: 1.6;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1)};
  margin: ${({ theme }) => theme.space(2)} 0;
`;

const Tag = styled.span`
  padding: ${({ theme }) => `${theme.space(0.5)} ${theme.space(1.5)}`};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 9999px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CreatorCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  padding: ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  margin: ${({ theme }) => theme.space(2)} 0;
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const CreatorSub = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1.5)};
  padding-top: ${({ theme }) => theme.space(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TaskDetailsModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskResponse | null;
  onTaken?: () => void;
  onMessageCreator?: () => void;
}

export function TaskDetailsModal({
  open,
  onClose,
  task,
  onTaken,
  onMessageCreator,
}: TaskDetailsModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  async function handleTakeTask() {
    if (!task) return;
    setLoading(true);
    try {
      await taskApi.takeTask(task.id);
      showToast(t("tasks.taken"));
      onTaken?.();
      onClose();
    } catch {
      showToast(t("tasks.takeError"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={task.title}>
      <StatusBadge $status={task.status}>{task.status.replace("_", " ")}</StatusBadge>

      <div style={{ marginTop: 16 }}>
        <InfoLabel>{t("tasks.description")}</InfoLabel>
        <Description>{task.description}</Description>
      </div>

      <InfoGrid>
        <div>
          <InfoLabel>{t("tasks.category")}</InfoLabel>
          <Tag>{task.categoryName || "—"}</Tag>
        </div>
        <div>
          <InfoLabel>{t("tasks.reward")}</InfoLabel>
          <RewardValue>{task.rewardAmount} ZION</RewardValue>
        </div>
        <div>
          <InfoLabel>{t("tasks.location")}</InfoLabel>
          <InfoValue>{task.locationText || "Remote"}</InfoValue>
        </div>
        <div>
          <InfoLabel>{t("tasks.deadline")}</InfoLabel>
          <InfoValue>{formatDate(task.deadlineAt)}</InfoValue>
        </div>
      </InfoGrid>

      {task.tags.length > 0 && (
        <>
          <InfoLabel>{t("tasks.hashtags")}</InfoLabel>
          <TagsRow>
            {task.tags.map((tag) => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </TagsRow>
        </>
      )}

      <CreatorCard>
        <Avatar>
          {task.creatorEmail?.charAt(0).toUpperCase() || "?"}
        </Avatar>
        <CreatorInfo>
          <CreatorName>{task.creatorEmail}</CreatorName>
          <CreatorSub>{t("tasks.creator")}</CreatorSub>
        </CreatorInfo>
      </CreatorCard>

      <Footer>
        {onMessageCreator && (
          <Button $variant="secondary" onClick={onMessageCreator}>
            {t("tasks.messageCreator")}
          </Button>
        )}
        {task.status === "OPEN" && (
          <Button onClick={handleTakeTask} disabled={loading}>
            {loading ? t("common.loading") : t("tasks.takeTask")}
          </Button>
        )}
      </Footer>
    </Modal>
  );
}
