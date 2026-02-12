import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../ui/Modal";
import { TextArea, Label, FormGroup } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { submissionApi } from "../../../lib/api";
import { showToast } from "../../ui/Toast";
import { Footer, Form, UploadSub, UploadText, UploadZone } from "./MarkDoneModal.styled";


interface MarkDoneModalProps {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
  onSubmitted?: () => void;
}

export function MarkDoneModal({ open, onClose, taskId, onSubmitted }: MarkDoneModalProps) {
  const { t } = useTranslation();
  const [proofText, setProofText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskId) return;
    setLoading(true);
    try {
      await submissionApi.submitTask(taskId, { proofText: proofText || undefined });
      showToast(t("tasks.submitted"));
      setProofText("");
      onSubmitted?.();
      onClose();
    } catch {
      showToast(t("tasks.submitError"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("tasks.markDone")} maxWidth="480px">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t("tasks.proofDescription")} *</Label>
          <TextArea
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder={t("tasks.proofPlaceholder")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("tasks.uploadProof")}</Label>
          <UploadZone>
            <UploadText>{t("tasks.uploadClick")}</UploadText>
            <UploadSub>PNG, JPG, PDF — max 10MB</UploadSub>
          </UploadZone>
        </FormGroup>

        <Footer>
          <Button type="button" $variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t("common.loading") : t("tasks.submitProof")}
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
}
