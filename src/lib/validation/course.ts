import type { CreateCourseInput, UpdateCourseInput } from "@/types/course";

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const toBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }
  return null;
};

export const validateCreateCourse = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const title = payload.title;
  const description = payload.description;
  const fileId = payload.fileId ?? payload.file_id;
  const readPrice = toNumber(payload.readPrice ?? payload.read_price);
  const readDiscountedPrice =
    payload.readDiscountedPrice ?? payload.read_discounted_price;
  const downloadPrice = toNumber(
    payload.downloadPrice ?? payload.download_price,
  );
  const downloadDiscountedPrice =
    payload.downloadDiscountedPrice ?? payload.download_discounted_price;
  const thumbnailUrl = payload.thumbnailUrl;
  const isActive = payload.isActive;

  if (!isNonEmptyString(id)) {
    errors.push("id is required.");
  }
  if (!isNonEmptyString(title)) {
    errors.push("title is required.");
  }
  if (!isNonEmptyString(description)) {
    errors.push("description is required.");
  }
  if (!isNonEmptyString(fileId)) {
    errors.push("fileId is required.");
  }
  if (readPrice === null || readPrice <= 0) {
    errors.push("readPrice must be a positive number.");
  }
  if (downloadPrice === null || downloadPrice <= 0) {
    errors.push("downloadPrice must be a positive number.");
  }

  let readDiscountValue: number | undefined;
  if (readDiscountedPrice !== undefined) {
    const parsedDiscount = toNumber(readDiscountedPrice);
    if (parsedDiscount === null || parsedDiscount < 0) {
      errors.push("readDiscountedPrice must be a non-negative number.");
    } else {
      readDiscountValue = parsedDiscount;
    }
  }

  let downloadDiscountValue: number | undefined;
  if (downloadDiscountedPrice !== undefined) {
    const parsedDiscount = toNumber(downloadDiscountedPrice);
    if (parsedDiscount === null || parsedDiscount < 0) {
      errors.push("downloadDiscountedPrice must be a non-negative number.");
    } else {
      downloadDiscountValue = parsedDiscount;
    }
  }

  if (readPrice !== null && readDiscountValue !== undefined) {
    if (readDiscountValue >= readPrice) {
      errors.push("readDiscountedPrice must be less than readPrice.");
    }
  }

  if (downloadPrice !== null && downloadDiscountValue !== undefined) {
    if (downloadDiscountValue >= downloadPrice) {
      errors.push("downloadDiscountedPrice must be less than downloadPrice.");
    }
  }

  if (thumbnailUrl !== undefined && !isNonEmptyString(thumbnailUrl)) {
    errors.push("thumbnailUrl must be a non-empty string when provided.");
  }

  if (isActive !== undefined && toBoolean(isActive) === null) {
    errors.push("isActive must be a boolean when provided.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const course: CreateCourseInput = {
    id: (id as string).trim(),
    title: (title as string).trim(),
    description: (description as string).trim(),
    readPrice: readPrice ?? 0,
    readDiscountedPrice: readDiscountValue,
    downloadPrice: downloadPrice ?? 0,
    downloadDiscountedPrice: downloadDiscountValue,
    thumbnailUrl: isNonEmptyString(thumbnailUrl)
      ? (thumbnailUrl as string).trim()
      : undefined,
    fileId: (fileId as string).trim(),
    isActive: toBoolean(isActive) ?? true,
  };

  return { course };
};

export const validateUpdateCourse = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const update: Record<string, unknown> = {};

  if (payload.id !== undefined && !isNonEmptyString(payload.id)) {
    errors.push("id must be a non-empty string when provided.");
  } else if (payload.id !== undefined) {
    update.id = payload.id;
  }

  if (payload.title !== undefined) {
    if (!isNonEmptyString(payload.title)) {
      errors.push("title must be a non-empty string when provided.");
    } else {
      update.title = payload.title;
    }
  }

  if (payload.description !== undefined) {
    if (!isNonEmptyString(payload.description)) {
      errors.push("description must be a non-empty string when provided.");
    } else {
      update.description = payload.description;
    }
  }

  const readPrice = payload.readPrice;
  if (readPrice !== undefined) {
    const parsed = toNumber(readPrice);
    if (parsed === null || parsed <= 0) {
      errors.push("read price must be a positive number when provided.");
    } else {
      update.readPrice = parsed;
    }
  }

  const readDiscountPrice = payload.discountedPrice;
  if (readDiscountPrice !== undefined) {
    const parsed = toNumber(readDiscountPrice);
    if (parsed === null || parsed < 0) {
      errors.push(
        "read Discounted Price must be a non-negative number when provided.",
      );
    } else {
      update.readDiscountedPrice = parsed;
    }
  }

  const downloadPrice = payload.downloadPrice;
  if (downloadPrice !== undefined) {
    const parsed = toNumber(downloadPrice);
    if (parsed === null || parsed <= 0) {
      errors.push("download Price must be a positive number when provided.");
    } else {
      update.downloadPrice = parsed;
    }
  }

  const downloadDiscountPrice = payload.downloadDiscountedPrice;
  if (downloadDiscountPrice !== undefined) {
    const parsed = toNumber(downloadDiscountPrice);
    if (parsed === null || parsed < 0) {
      errors.push(
        "download Discounted Price must be a non-negative number when provided.",
      );
    } else {
      update.downloadDiscountedPrice = parsed;
    }
  }

  if (payload.thumbnailUrl !== undefined) {
    if (!isNonEmptyString(payload.thumbnailUrl)) {
      errors.push("thumbnailUrl must be a non-empty string when provided.");
    } else {
      update.thumbnailUrl = payload.thumbnailUrl;
    }
  }

  const fileId = payload.fileId ?? payload.file_id;
  if (fileId !== undefined) {
    if (!isNonEmptyString(fileId)) {
      errors.push("fileId must be a non-empty string when provided.");
    } else {
      update.fileId = fileId;
    }
  }

  if (payload.isActive !== undefined) {
    const parsed = toBoolean(payload.isActive);
    if (parsed === null) {
      errors.push("isActive must be a boolean when provided.");
    } else {
      update.isActive = parsed;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  if (
    update.readPrice !== undefined &&
    update.readDiscountedPrice !== undefined
  ) {
    if (Number(update.readDiscountedPrice) >= Number(update.readPrice)) {
      return {
        errors: ["readDiscountedPrice must be less than readPrice."],
      };
    }
  }

  if (
    update.downloadPrice !== undefined &&
    update.downloadDiscountedPrice !== undefined
  ) {
    if (
      Number(update.downloadDiscountedPrice) >= Number(update.downloadPrice)
    ) {
      return {
        errors: ["downloadDiscountedPrice must be less than downloadPrice."],
      };
    }
  }

  return {
    update: update as UpdateCourseInput,
  };
};
