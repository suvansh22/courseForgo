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
  const originalPrice = toNumber(payload.originalPrice);
  const discountedPrice = payload.discountedPrice;
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
  if (originalPrice === null || originalPrice <= 0) {
    errors.push("originalPrice must be a positive number.");
  }

  let discountValue: number | undefined;
  if (discountedPrice !== undefined) {
    const parsedDiscount = toNumber(discountedPrice);
    if (parsedDiscount === null || parsedDiscount < 0) {
      errors.push("discountedPrice must be a non-negative number.");
    } else {
      discountValue = parsedDiscount;
    }
  }

  if (originalPrice !== null && discountValue !== undefined) {
    if (discountValue >= originalPrice) {
      errors.push("discountedPrice must be less than originalPrice.");
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
    originalPrice: originalPrice ?? 0,
    discountedPrice: discountValue,
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

  if (payload.originalPrice !== undefined) {
    const parsed = toNumber(payload.originalPrice);
    if (parsed === null || parsed <= 0) {
      errors.push("originalPrice must be a positive number when provided.");
    } else {
      update.originalPrice = parsed;
    }
  }

  if (payload.discountedPrice !== undefined) {
    const parsed = toNumber(payload.discountedPrice);
    if (parsed === null || parsed < 0) {
      errors.push("discountedPrice must be a non-negative number when provided.");
    } else {
      update.discountedPrice = parsed;
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

  if (update.originalPrice !== undefined && update.discountedPrice !== undefined) {
    if (Number(update.discountedPrice) >= Number(update.originalPrice)) {
      return {
        errors: ["discountedPrice must be less than originalPrice."],
      };
    }
  }

  return {
    update: update as UpdateCourseInput,
  };
};
