import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import type { ApiError } from "@/types/api";

const MISSING_DB_MESSAGE = "D1 database binding 'DB' is not configured.";

const errorResponse = (
  status: number,
  code: ApiError["code"],
  error: string,
  details?: string[],
) =>
  NextResponse.json<ApiError>(
    {
      code,
      error,
      details,
    },
    { status },
  );

export const unauthorized = () =>
  errorResponse(401, "UNAUTHORIZED", "Unauthorized");

export const badRequest = (message: string, details?: string[]) =>
  errorResponse(400, "BAD_REQUEST", message, details);

export const invalidJson = () =>
  badRequest("Invalid JSON body.");

export const validationFailed = (details: string[]) =>
  errorResponse(400, "VALIDATION_FAILED", "Validation failed.", details);

export const notFound = (message: string) =>
  errorResponse(404, "NOT_FOUND", message);

export const conflict = (message: string) =>
  errorResponse(409, "CONFLICT", message);

export const serverError = (error: unknown, fallbackMessage: string) => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const isMissingDbBinding = message.includes(MISSING_DB_MESSAGE);

  if (isMissingDbBinding) {
    return errorResponse(
      503,
      "DATABASE_NOT_CONFIGURED",
      "Database is not configured for this environment.",
      process.env.NODE_ENV === "development" ? [message] : undefined,
    );
  }

  return errorResponse(
    500,
    "INTERNAL_ERROR",
    fallbackMessage,
    process.env.NODE_ENV === "development" ? [message] : undefined,
  );
};

export const hasSession = (session: Session | null): session is Session =>
  session !== null;
