import type { Purchase } from "@/types/purchase";

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export const validateCreatePurchase = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const userId = payload.userId;
  const courseId = payload.courseId;

  if (!isNonEmptyString(id)) {
    errors.push("id is required.");
  }
  if (!isNonEmptyString(userId)) {
    errors.push("userId is required.");
  }
  if (!isNonEmptyString(courseId)) {
    errors.push("courseId is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const purchase: Purchase = {
    id: (id as string).trim(),
    userId: (userId as string).trim(),
    courseId: (courseId as string).trim(),
    purchasedAt: new Date().toISOString(),
  };

  return { purchase };
};
