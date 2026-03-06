import type { ACCESS_TYPE, Purchase } from "@/types/purchase";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const validateCreatePurchase = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const userId = payload.userId;
  const courseId = payload.courseId;
  const accessType = payload.accessType;
  const link = payload.link;

  if (!isNonEmptyString(id)) {
    errors.push("id is required.");
  }
  if (!isNonEmptyString(userId)) {
    errors.push("userId is required.");
  }
  if (!isNonEmptyString(courseId)) {
    errors.push("courseId is required.");
  }
  if (accessType !== "read_only" && accessType !== "can_download") {
    errors.push("accessType must be either read_only or can_download.");
  }
  if (link !== undefined && !isNonEmptyString(link)) {
    errors.push("link, when provided, must be a non-empty string.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const purchase: Purchase = {
    id: (id as string).trim(),
    userId: (userId as string).trim(),
    courseId: (courseId as string).trim(),
    accessType: accessType as ACCESS_TYPE,
    link: isNonEmptyString(link) ? link.trim() : undefined,
    purchasedAt: new Date().toISOString(),
  };

  return { purchase };
};
