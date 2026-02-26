"use client";

import { DESCRIPTION_MAX, TITLE_MAX } from "@/components/constants/admin";
import { useSnackbar } from "@/components/providers/snackbarProvider";
import { toSlug } from "@/components/utils/toSlug";
import Button from "antd/es/button";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import { useMemo, useState } from "react";
import styles from "./adminCourseForm.module.css";

export type CourseFormValues = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  pdfName?: string;
  file_id?: string;
};

type Props = {
  editingCourse: CourseFormValues | null;
  onSave: (values: CourseFormValues) => void;
  onCancel: () => void;
};

const AdminCourseForm = ({ editingCourse, onSave, onCancel }: Props) => {
  const { showSnackbar } = useSnackbar();
  const [title, setTitle] = useState(editingCourse?.title ?? "");
  const [description, setDescription] = useState(
    editingCourse?.description ?? "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    editingCourse?.originalPrice?.toString() ?? "",
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    editingCourse?.discountedPrice?.toString() ?? "",
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    editingCourse?.thumbnailUrl ?? "",
  );
  const [fileId, setFileId] = useState(
    editingCourse?.file_id ?? editingCourse?.pdfName ?? "",
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    originalPrice: false,
    discountedPrice: false,
    thumbnailUrl: false,
    fileId: false,
  });

  const id = useMemo(
    () => editingCourse?.id ?? toSlug(title),
    [editingCourse?.id, title],
  );

  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    const priceValue = Number(originalPrice);
    const discountValue = discountedPrice ? Number(discountedPrice) : undefined;

    // Title: required
    if (!title.trim()) {
      errors.title = "Title is required.";
    }

    // Description: required
    if (!description.trim()) {
      errors.description = "Description is required.";
    }

    // Price: required, only number
    if (!originalPrice.trim()) {
      errors.originalPrice = "Price is required.";
    } else if (!Number.isFinite(priceValue)) {
      errors.originalPrice = "Price must be a valid number.";
    }

    // Discount price: optional, only number, must be less than original price
    if (discountedPrice.trim()) {
      if (!Number.isFinite(discountValue)) {
        errors.discountedPrice = "Discount must be a valid number.";
      } else if (
        Number.isFinite(priceValue) &&
        (discountValue ?? 0) >= priceValue
      ) {
        errors.discountedPrice = "Discount must be less than the price.";
      }
    }

    // Google Drive file_id: required
    if (!fileId.trim()) {
      errors.fileId = "Google Drive file id is required.";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  }, [title, description, originalPrice, discountedPrice, fileId]);

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const shouldShowError = (field: keyof typeof touched) =>
    (hasSubmitted || touched[field]) && !!validation.errors[field];

  const handleSave = () => {
    setHasSubmitted(true);
    if (!validation.isValid) {
      showSnackbar("error", {
        content: "Please fix the highlighted fields before saving.",
        key: "course-form-validation",
      });
      return;
    }
    const price = Number(originalPrice);
    const discount = discountedPrice ? Number(discountedPrice) : undefined;
    onSave({
      id: id || toSlug(title),
      title: title.trim(),
      description: description.trim(),
      originalPrice: price,
      discountedPrice: discount,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      file_id: fileId.trim(),
    });
  };

  return (
    <section className={styles.card}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <Input
            placeholder="e.g. Advanced React Patterns"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => markTouched("title")}
            status={shouldShowError("title") ? "error" : undefined}
            maxLength={TITLE_MAX}
            showCount
          />
          {shouldShowError("title") && (
            <span className={styles.error}>{validation.errors.title}</span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Slug</span>
          <Input value={id} disabled />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Description</span>
        <TextArea
          rows={4}
          placeholder="What will students learn?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => markTouched("description")}
          status={shouldShowError("description") ? "error" : undefined}
          maxLength={DESCRIPTION_MAX}
          showCount
        />
        {shouldShowError("description") && (
          <span className={styles.error}>{validation.errors.description}</span>
        )}
      </label>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Price</span>
          <Input
            type="number"
            placeholder="1999"
            value={originalPrice}
            onChange={(event) => setOriginalPrice(event.target.value)}
            onBlur={() => markTouched("originalPrice")}
            status={shouldShowError("originalPrice") ? "error" : undefined}
          />
          {shouldShowError("originalPrice") && (
            <span className={styles.error}>
              {validation.errors.originalPrice}
            </span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Discount Price (optional)</span>
          <Input
            type="number"
            placeholder="1499"
            value={discountedPrice}
            onChange={(event) => setDiscountedPrice(event.target.value)}
            onBlur={() => markTouched("discountedPrice")}
            status={shouldShowError("discountedPrice") ? "error" : undefined}
          />
          {shouldShowError("discountedPrice") && (
            <span className={styles.error}>
              {validation.errors.discountedPrice}
            </span>
          )}
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Image URL (optional)</span>
          <Input
            placeholder="https://..."
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            onBlur={() => markTouched("thumbnailUrl")}
            status={shouldShowError("thumbnailUrl") ? "error" : undefined}
          />
          {shouldShowError("thumbnailUrl") && (
            <span className={styles.error}>
              {validation.errors.thumbnailUrl}
            </span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Google Drive file id</span>
          <Input
            placeholder="e.g. 1AbCdEfGhIJkLmNoPqRsTuVwXyZ"
            value={fileId}
            onChange={(event) => setFileId(event.target.value)}
            onBlur={() => markTouched("fileId")}
            status={shouldShowError("fileId") ? "error" : undefined}
          />
          {shouldShowError("fileId") && (
            <span className={styles.error}>{validation.errors.fileId}</span>
          )}
        </label>
      </div>

      <div className={styles.actions}>
        {editingCourse ? <Button onClick={onCancel}>Cancel</Button> : null}
        <Button type="primary" onClick={handleSave}>
          {editingCourse ? "Save Changes" : "Create Course"}
        </Button>
      </div>
    </section>
  );
};

export default AdminCourseForm;
