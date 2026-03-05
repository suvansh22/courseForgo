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
  readPrice: number;
  readDiscountedPrice?: number;
  downloadPrice: number;
  downloadDiscountedPrice?: number;
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
  const [readPrice, setReadPrice] = useState(
    editingCourse?.readPrice?.toString() ?? "",
  );
  const [readDiscountedPrice, setReadDiscountedPrice] = useState(
    editingCourse?.readDiscountedPrice?.toString() ?? "",
  );
  const [downloadPrice, setDownloadPrice] = useState(
    editingCourse?.downloadPrice?.toString() ?? "",
  );
  const [downloadDiscountedPrice, setDownloadDiscountedPrice] = useState(
    editingCourse?.downloadDiscountedPrice?.toString() ?? "",
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
    readPrice: false,
    readDiscountedPrice: false,
    downloadPrice: false,
    downloadDiscountedPrice: false,
    thumbnailUrl: false,
    fileId: false,
  });

  const id = useMemo(
    () => editingCourse?.id ?? toSlug(title),
    [editingCourse?.id, title],
  );

  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    const readPriceValue = Number(readPrice);
    const readDiscountValue = readDiscountedPrice
      ? Number(readDiscountedPrice)
      : undefined;
    const downloadPriceValue = Number(downloadPrice);
    const downloadDiscountValue = downloadDiscountedPrice
      ? Number(downloadDiscountedPrice)
      : undefined;

    // Title: required
    if (!title.trim()) {
      errors.title = "Title is required.";
    }

    // Description: required
    if (!description.trim()) {
      errors.description = "Description is required.";
    }

    // Read price: required
    if (!readPrice.trim()) {
      errors.readPrice = "Read price is required.";
    } else if (!Number.isFinite(readPriceValue)) {
      errors.readPrice = "Read price must be a valid number.";
    }

    // Read discount: optional, must be less than read price
    if (readDiscountedPrice.trim()) {
      if (!Number.isFinite(readDiscountValue)) {
        errors.readDiscountedPrice = "Read discount must be a valid number.";
      } else if (
        Number.isFinite(readPriceValue) &&
        (readDiscountValue ?? 0) >= readPriceValue
      ) {
        errors.readDiscountedPrice =
          "Read discount must be less than read price.";
      }
    }

    // Download price: required
    if (!downloadPrice.trim()) {
      errors.downloadPrice = "Download price is required.";
    } else if (!Number.isFinite(downloadPriceValue)) {
      errors.downloadPrice = "Download price must be a valid number.";
    }

    // Download discount: optional, must be less than download price
    if (downloadDiscountedPrice.trim()) {
      if (!Number.isFinite(downloadDiscountValue)) {
        errors.downloadDiscountedPrice =
          "Download discount must be a valid number.";
      } else if (
        Number.isFinite(downloadPriceValue) &&
        (downloadDiscountValue ?? 0) >= downloadPriceValue
      ) {
        errors.downloadDiscountedPrice =
          "Download discount must be less than download price.";
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
  }, [
    title,
    description,
    readPrice,
    readDiscountedPrice,
    downloadPrice,
    downloadDiscountedPrice,
    fileId,
  ]);

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
    const parsedReadPrice = Number(readPrice);
    const parsedReadDiscount = readDiscountedPrice
      ? Number(readDiscountedPrice)
      : undefined;
    const parsedDownloadPrice = Number(downloadPrice);
    const parsedDownloadDiscount = downloadDiscountedPrice
      ? Number(downloadDiscountedPrice)
      : undefined;
    onSave({
      id: id || toSlug(title),
      title: title.trim(),
      description: description.trim(),
      readPrice: parsedReadPrice,
      readDiscountedPrice: parsedReadDiscount,
      downloadPrice: parsedDownloadPrice,
      downloadDiscountedPrice: parsedDownloadDiscount,
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
          <span className={styles.label}>Read Price</span>
          <Input
            type="number"
            placeholder="1999"
            value={readPrice}
            onChange={(event) => setReadPrice(event.target.value)}
            onBlur={() => markTouched("readPrice")}
            status={shouldShowError("readPrice") ? "error" : undefined}
          />
          {shouldShowError("readPrice") && (
            <span className={styles.error}>{validation.errors.readPrice}</span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Read Discount Price (optional)</span>
          <Input
            type="number"
            placeholder="1499"
            value={readDiscountedPrice}
            onChange={(event) => setReadDiscountedPrice(event.target.value)}
            onBlur={() => markTouched("readDiscountedPrice")}
            status={
              shouldShowError("readDiscountedPrice") ? "error" : undefined
            }
          />
          {shouldShowError("readDiscountedPrice") && (
            <span className={styles.error}>
              {validation.errors.readDiscountedPrice}
            </span>
          )}
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Download Price</span>
          <Input
            type="number"
            placeholder="2999"
            value={downloadPrice}
            onChange={(event) => setDownloadPrice(event.target.value)}
            onBlur={() => markTouched("downloadPrice")}
            status={shouldShowError("downloadPrice") ? "error" : undefined}
          />
          {shouldShowError("downloadPrice") && (
            <span className={styles.error}>
              {validation.errors.downloadPrice}
            </span>
          )}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>
            Download Discount Price (optional)
          </span>
          <Input
            type="number"
            placeholder="2499"
            value={downloadDiscountedPrice}
            onChange={(event) => setDownloadDiscountedPrice(event.target.value)}
            onBlur={() => markTouched("downloadDiscountedPrice")}
            status={
              shouldShowError("downloadDiscountedPrice") ? "error" : undefined
            }
          />
          {shouldShowError("downloadDiscountedPrice") && (
            <span className={styles.error}>
              {validation.errors.downloadDiscountedPrice}
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
