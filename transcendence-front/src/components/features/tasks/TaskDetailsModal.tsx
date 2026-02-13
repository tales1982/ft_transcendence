import { useTranslation } from "react-i18next";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { StatusBadge } from "../../ui/Badge";
import { Avatar } from "../../ui/Avatar";
import type { TaskResponse } from "../../../types";
import { taskApi } from "../../../lib/api";
import { showToast } from "../../ui/Toast";
import { useState } from "react";
import { Footer } from "./MarkDoneModal.styled";
import  { InfoLabel, Description, InfoGrid, Tag, RewardValue, InfoValue, TagsRow, CreatorCard, CreatorInfo, CreatorName, CreatorSub } from "./TaskDetailsModal.styled";



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
