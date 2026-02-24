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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validatePdfAssetCreate = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const storageKey = payload.storageKey;
  const originalName = payload.originalName;
  const sizeBytes = toNumber(payload.sizeBytes);
  const mimeType = payload.mimeType;
  const checksum = payload.checksum;
  const pages = payload.pages;

  if (!isNonEmptyString(id)) {
    errors.push("pdfAsset.id is required.");
  }
  if (!isNonEmptyString(storageKey)) {
    errors.push("pdfAsset.storageKey is required.");
  }
  if (!isNonEmptyString(originalName)) {
    errors.push("pdfAsset.originalName is required.");
  }
  if (sizeBytes === null || sizeBytes <= 0) {
    errors.push("pdfAsset.sizeBytes must be a positive number.");
  }
  if (!isNonEmptyString(mimeType) || mimeType !== "application/pdf") {
    errors.push("pdfAsset.mimeType must be application/pdf.");
  }
  if (checksum !== undefined && !isNonEmptyString(checksum)) {
    errors.push("pdfAsset.checksum must be a non-empty string when provided.");
  }

  let parsedPages: number | undefined;
  if (pages !== undefined) {
    const parsed = toNumber(pages);
    if (parsed === null || parsed <= 0) {
      errors.push("pdfAsset.pages must be a positive number when provided.");
    } else {
      parsedPages = parsed;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    pdfAsset: {
      id: (id as string).trim(),
      storageKey: (storageKey as string).trim(),
      originalName: (originalName as string).trim(),
      sizeBytes: sizeBytes ?? 0,
      mimeType: "application/pdf" as const,
      checksum: isNonEmptyString(checksum) ? (checksum as string).trim() : undefined,
      pages: parsedPages,
    },
  };
};

const validatePdfAssetUpdate = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const update: Record<string, unknown> = {};

  if (payload.id !== undefined) {
    errors.push("pdfAsset.id cannot be changed on update.");
  }

  if (payload.storageKey !== undefined) {
    if (!isNonEmptyString(payload.storageKey)) {
      errors.push("pdfAsset.storageKey must be a non-empty string when provided.");
    } else {
      update.storageKey = payload.storageKey;
    }
  }

  if (payload.originalName !== undefined) {
    if (!isNonEmptyString(payload.originalName)) {
      errors.push("pdfAsset.originalName must be a non-empty string when provided.");
    } else {
      update.originalName = payload.originalName;
    }
  }

  if (payload.sizeBytes !== undefined) {
    const parsed = toNumber(payload.sizeBytes);
    if (parsed === null || parsed <= 0) {
      errors.push("pdfAsset.sizeBytes must be a positive number when provided.");
    } else {
      update.sizeBytes = parsed;
    }
  }

  if (payload.mimeType !== undefined) {
    if (
      !isNonEmptyString(payload.mimeType) ||
      payload.mimeType !== "application/pdf"
    ) {
      errors.push("pdfAsset.mimeType must be application/pdf when provided.");
    } else {
      update.mimeType = payload.mimeType;
    }
  }

  if (payload.checksum !== undefined) {
    if (!isNonEmptyString(payload.checksum)) {
      errors.push("pdfAsset.checksum must be a non-empty string when provided.");
    } else {
      update.checksum = payload.checksum;
    }
  }

  if (payload.pages !== undefined) {
    const parsed = toNumber(payload.pages);
    if (parsed === null || parsed <= 0) {
      errors.push("pdfAsset.pages must be a positive number when provided.");
    } else {
      update.pages = parsed;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { update };
};

export const validateCreateCourse = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const title = payload.title;
  const description = payload.description;
  const originalPrice = toNumber(payload.originalPrice);
  const discountedPrice = payload.discountedPrice;
  const thumbnailUrl = payload.thumbnailUrl;
  const isActive = payload.isActive;
  const pdfAssetPayload = payload.pdfAsset;

  if (!isNonEmptyString(id)) {
    errors.push("id is required.");
  }
  if (!isNonEmptyString(title)) {
    errors.push("title is required.");
  }
  if (!isNonEmptyString(description)) {
    errors.push("description is required.");
  }
  if (originalPrice === null || originalPrice <= 0) {
    errors.push("originalPrice must be a positive number.");
  }
  if (!isRecord(pdfAssetPayload)) {
    errors.push("pdfAsset is required.");
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

  const pdfAssetValidation = validatePdfAssetCreate(
    pdfAssetPayload as Record<string, unknown>,
  );
  if (pdfAssetValidation.errors) {
    return { errors: pdfAssetValidation.errors };
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
    pdfAssetId: pdfAssetValidation.pdfAsset!.id,
    isActive: toBoolean(isActive) ?? true,
  };

  return { course, pdfAsset: pdfAssetValidation.pdfAsset };
};

export const validateUpdateCourse = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const update: Record<string, unknown> = {};
  const pdfAssetPayload = payload.pdfAsset;

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

  if (payload.pdfAssetId !== undefined) {
    if (!isNonEmptyString(payload.pdfAssetId)) {
      errors.push("pdfAssetId must be a non-empty string when provided.");
    } else {
      update.pdfAssetId = payload.pdfAssetId;
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

  let pdfAssetUpdate:
    | ReturnType<typeof validatePdfAssetUpdate>["update"]
    | undefined;
  if (pdfAssetPayload !== undefined) {
    if (!isRecord(pdfAssetPayload)) {
      return { errors: ["pdfAsset must be an object when provided."] };
    }
    const pdfValidation = validatePdfAssetUpdate(
      pdfAssetPayload as Record<string, unknown>,
    );
    if (pdfValidation.errors) {
      return { errors: pdfValidation.errors };
    }
    pdfAssetUpdate = pdfValidation.update;
  }

  return {
    update: update as UpdateCourseInput,
    pdfAssetUpdate,
  };
};
