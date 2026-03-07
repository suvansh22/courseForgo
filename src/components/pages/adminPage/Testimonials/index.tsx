"use client";

import { useSnackbar } from "@/components/providers/snackbarProvider";
import {
  getAdminTestimonials,
  overwriteAdminTestimonials,
} from "@/lib/api/testimonials";
import type { Testimonial } from "@/types/testimonial";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "antd/es/button";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import Spin from "antd/es/spin";
import Switch from "antd/es/switch";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type FormState = {
  name: string;
  feedback: string;
  sortOrder: number;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  feedback: "",
  sortOrder: 0,
  isActive: true,
};

const toForm = (testimonial: Testimonial): FormState => ({
  name: testimonial.name,
  feedback: testimonial.feedback,
  sortOrder: testimonial.sortOrder,
  isActive: testimonial.isActive,
});

const AdminTestimonialsPageComponent = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [localItems, setLocalItems] = useState<Testimonial[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin_get_testimonials"],
    queryFn: getAdminTestimonials,
    refetchOnWindowFocus: false,
  });
  const items = localItems ?? data?.testimonials ?? [];

  useEffect(() => {
    if (isError) {
      showSnackbar("error", { content: "Failed to load testimonials." });
    }
  }, [isError, showSnackbar]);

  const saveAllMutation = useMutation({
    mutationFn: overwriteAdminTestimonials,
    onSuccess: (response) => {
      setLocalItems(response.testimonials);
      queryClient.setQueryData(["admin_get_testimonials"], response);
      showSnackbar("success", { content: "Testimonials saved." });
    },
    onError: () => {
      showSnackbar("error", { content: "Failed to save testimonials." });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleUpsertLocal = () => {
    if (!form.name.trim() || !form.feedback.trim()) {
      showSnackbar("warning", {
        content: "Name and feedback are required.",
      });
      return;
    }

    if (editingId) {
      setLocalItems((prev) => {
        const base = prev ?? data?.testimonials ?? [];
        return base.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                feedback: form.feedback.trim(),
                sortOrder: form.sortOrder,
                isActive: form.isActive,
              }
            : item,
        );
      });
      showSnackbar("success", {
        content: "Updated locally. Save changes to persist.",
      });
      resetForm();
      return;
    }

    const now = new Date().toISOString();
    setLocalItems((prev) => {
      const base = prev ?? data?.testimonials ?? [];
      return [
        {
          id: crypto.randomUUID(),
          name: form.name.trim(),
          feedback: form.feedback.trim(),
          sortOrder: form.sortOrder,
          isActive: form.isActive,
          createdAt: now,
          updatedAt: now,
        },
        ...base,
      ];
    });
    showSnackbar("success", {
      content: "Added locally. Save changes to persist.",
    });
    resetForm();
  };

  const handleDeleteLocal = (id: string) => {
    setLocalItems((prev) => {
      const base = prev ?? data?.testimonials ?? [];
      return base.filter((item) => item.id !== id);
    });
    if (editingId === id) resetForm();
    showSnackbar("success", {
      content: "Removed locally. Save changes to persist.",
    });
  };

  const handleSaveAll = () => {
    saveAllMutation.mutate({
      testimonials: items.map((item) => ({
        id: item.id,
        name: item.name,
        feedback: item.feedback,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
      })),
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Admin</p>
          <h1 className={styles.title}>Testimonials</h1>
        </div>
        <p className={styles.subtitle}>
          Edit the list locally, then save once to overwrite DB.
        </p>
      </header>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <div className={styles.headerActions}>
            {editingId ? (
              <Button onClick={resetForm} size="small">
                Cancel Edit
              </Button>
            ) : null}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveAll}
              loading={saveAllMutation.isPending}
            >
              Save All
            </Button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Name</span>
            <Input
              value={form.name}
              maxLength={80}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Learner name"
            />
          </label>
          <label className={styles.field}>
            <span>Sort Order</span>
            <InputNumber
              value={form.sortOrder}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, sortOrder: Number(value ?? 0) }))
              }
              className={styles.numberInput}
            />
          </label>
          <label className={styles.fieldWide}>
            <span>Feedback</span>
            <Input.TextArea
              value={form.feedback}
              rows={4}
              maxLength={500}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, feedback: event.target.value }))
              }
              placeholder="Write the testimonial"
            />
          </label>
          <div className={styles.switchRow}>
            <span>Active</span>
            <Switch
              checked={form.isActive}
              onChange={(checked) =>
                setForm((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button type="primary" onClick={handleUpsertLocal}>
            {editingId ? "Update Local" : "Add Local"}
          </Button>
        </div>
      </section>

      <section className={styles.listSection}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <p className={styles.empty}>No testimonials yet.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.itemCopy}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemFeedback}>{item.feedback}</p>
                  <p className={styles.meta}>
                    sort: {item.sortOrder} |{" "}
                    {item.isActive ? "active" : "hidden"}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingId(item.id);
                      setForm(toForm(item));
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteLocal(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminTestimonialsPageComponent;
