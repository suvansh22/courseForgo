"use client";

import { DESCRIPTION_MAX, TITLE_MAX } from "@/components/constants/admin";
import { useSnackbar } from "@/components/providers/snackbarProvider";
import { toSlug } from "@/components/utils/toSlug";
import Button from "antd/es/button";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent, useMemo, useState } from "react";
import styles from "./adminCourseForm.module.css";

export type CourseFormValues = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  pdfName?: string;
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
  const [pdfName, setPdfName] = useState(editingCourse?.pdfName ?? "");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    originalPrice: false,
    discountedPrice: false,
    thumbnailUrl: false,
    pdfName: false,
  });

  const id = useMemo(
    () => editingCourse?.id ?? toSlug(title),
    [editingCourse?.id, title],
  );

  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const priceValue = Number(originalPrice);
    const discountValue = discountedPrice ? Number(discountedPrice) : undefined;

    if (!trimmedTitle) {
      errors.title = "Title is required.";
    } else if (trimmedTitle.length > TITLE_MAX) {
      errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    }

    if (!trimmedDescription) {
      errors.description = "Description is required.";
    } else if (trimmedDescription.length > DESCRIPTION_MAX) {
      errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
    }

    if (!originalPrice.trim()) {
      errors.originalPrice = "Price is required.";
    } else if (!Number.isFinite(priceValue)) {
      errors.originalPrice = "Price must be a valid number.";
    } else if (priceValue <= 0) {
      errors.originalPrice = "Price must be greater than 0.";
    }

    if (discountedPrice.trim()) {
      if (!Number.isFinite(discountValue)) {
        errors.discountedPrice = "Discount must be a valid number.";
      } else if ((discountValue ?? 0) < 0) {
        errors.discountedPrice = "Discount cannot be negative.";
      } else if (
        Number.isFinite(priceValue) &&
        (discountValue ?? 0) >= priceValue
      ) {
        errors.discountedPrice = "Discount must be less than the price.";
      }
    }

    if (thumbnailUrl.trim()) {
      try {
        const parsedUrl = new URL(thumbnailUrl.trim());
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          errors.thumbnailUrl =
            "Image URL must start with http:// or https://.";
        }
      } catch {
        errors.thumbnailUrl = "Image URL must be a valid URL.";
      }
    }

    if (pdfName && !pdfName.toLowerCase().endsWith(".pdf")) {
      errors.pdfName = "Course PDF must be a .pdf file.";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  }, [
    title,
    description,
    originalPrice,
    discountedPrice,
    thumbnailUrl,
    pdfName,
  ]);

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const shouldShowError = (field: keyof typeof touched) =>
    hasSubmitted || touched[field];

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfName(file.name);
    }
  };

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
      pdfName: pdfName || undefined,
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
          {shouldShowError("title") && validation.errors.title ? (
            <span className={styles.error}>{validation.errors.title}</span>
          ) : null}
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
        {shouldShowError("description") && validation.errors.description ? (
          <span className={styles.error}>{validation.errors.description}</span>
        ) : null}
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
          {shouldShowError("originalPrice") &&
          validation.errors.originalPrice ? (
            <span className={styles.error}>
              {validation.errors.originalPrice}
            </span>
          ) : null}
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
          {shouldShowError("discountedPrice") &&
          validation.errors.discountedPrice ? (
            <span className={styles.error}>
              {validation.errors.discountedPrice}
            </span>
          ) : null}
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
          {shouldShowError("thumbnailUrl") && validation.errors.thumbnailUrl ? (
            <span className={styles.error}>
              {validation.errors.thumbnailUrl}
            </span>
          ) : null}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Course PDF (optional)</span>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            onBlur={() => markTouched("pdfName")}
            status={shouldShowError("pdfName") ? "error" : undefined}
          />
          {pdfName ? <span className={styles.helper}>{pdfName}</span> : null}
          {shouldShowError("pdfName") && validation.errors.pdfName ? (
            <span className={styles.error}>{validation.errors.pdfName}</span>
          ) : null}
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
