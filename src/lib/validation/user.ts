import type { User } from "@/types/user";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isEmailLike = (value: string) => value.includes("@");

export const validateCreateUser = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const id = payload.id;
  const email = payload.email;

  if (!isNonEmptyString(id)) {
    errors.push("id is required.");
  }
  if (!isNonEmptyString(email) || !isEmailLike(email)) {
    errors.push("email must be a valid email.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const validId = id as string;
  const validEmail = email as string;
  const normalizedEmail = validEmail.trim().toLowerCase();

  const now = new Date().toISOString();
  const user: User = {
    id: validId.trim(),
    email: normalizedEmail,
    createdAt: now,
    updatedAt: now,
  };

  return { user };
};
