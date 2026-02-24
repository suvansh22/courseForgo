export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_FAILED"
  | "DATABASE_NOT_CONFIGURED"
  | "INTERNAL_ERROR";

export type ApiError = {
  code: ApiErrorCode;
  error: string;
  details?: string[];
};
