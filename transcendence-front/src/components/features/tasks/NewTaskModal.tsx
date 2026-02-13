import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../ui/Modal";
import { Input, TextArea, Label, FormGroup } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories } from "../../../store/slices/tasks.slice";
import { taskApi } from "../../../lib/api";
import { showToast } from "../../ui/Toast";
import { Form, Footer } from "./MarkDoneModal.styled";
import { CategoryWrapper, Row, SuggestionItem, SuggestionList } from "./NewTaskModal.styled";



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
