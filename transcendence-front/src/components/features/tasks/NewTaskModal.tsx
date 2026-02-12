import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal } from "../../ui/Modal";
import { Input, TextArea, Label, FormGroup } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories } from "../../../store/slices/tasks.slice";
import { taskApi } from "../../../lib/api";
import { showToast } from "../../ui/Toast";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2.5)};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(1.5)};
  padding-top: ${({ theme }) => theme.space(2)};
`;

const SuggestionList = styled.div`
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const SuggestionItem = styled.div`
  padding: ${({ theme }) => theme.space(1.5)};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

const CategoryWrapper = styled.div`
  position: relative;
`;

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewTaskModal({ open, onClose }: NewTaskModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.tasks.categories);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tags, setTags] = useState("");
  const [reward, setReward] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [open, categories.length, dispatch]);

  useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow.toISOString().slice(0, 16));
    }
  }, [open]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategorySearch("");
    setCategoryId(undefined);
    setTags("");
    setReward("");
    setLocation("");
    setDeadline("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await taskApi.createTask({
        title,
        description,
        categoryId,
        rewardAmount: reward ? Number(reward) : undefined,
        locationText: location || undefined,
        deadlineAt: deadline || undefined,
        tags: tags
          .split(" ")
          .filter((t) => t.startsWith("#"))
          .map((t) => t.slice(1)),
      });
      showToast(t("tasks.created"));
      resetForm();
      onClose();
    } catch {
      showToast(t("tasks.createError"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("tasks.newTask")}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t("tasks.title")} *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormGroup>

        <FormGroup>
          <Label>{t("tasks.description")} *</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("tasks.category")} *</Label>
          <CategoryWrapper>
            <Input
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowSuggestions(true);
                setCategoryId(undefined);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t("tasks.categoryPlaceholder")}
              required
            />
            {showSuggestions && categorySearch && filteredCategories.length > 0 && (
              <SuggestionList>
                {filteredCategories.map((c) => (
                  <SuggestionItem
                    key={c.id}
                    onClick={() => {
                      setCategorySearch(c.name);
                      setCategoryId(c.id);
                      setShowSuggestions(false);
                    }}
                  >
                    {c.name}
                  </SuggestionItem>
                ))}
              </SuggestionList>
            )}
          </CategoryWrapper>
        </FormGroup>

        <FormGroup>
          <Label>{t("tasks.hashtags")}</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#webdesign #responsive #modern"
          />
        </FormGroup>

        <Row>
          <FormGroup>
            <Label>{t("tasks.reward")} (ZION) *</Label>
            <Input
              type="number"
              min="1"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t("tasks.location")} *</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </FormGroup>
        </Row>

        <FormGroup>
          <Label>{t("tasks.deadline")} *</Label>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </FormGroup>

        <Footer>
          <Button type="button" $variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t("common.loading") : t("tasks.createTask")}
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
}
