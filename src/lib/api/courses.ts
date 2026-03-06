import { fetchJson } from "@/lib/http/client";
import type {
  CoursesWithPurchaseInfoResponse,
  CourseWithPurchaseInfoResponse,
} from "@/types/course";

export const getCourses = () =>
  fetchJson<CoursesWithPurchaseInfoResponse>("/api/courses?isAdmin=false");

export const getCourseById = (courseId: string) =>
  fetchJson<CourseWithPurchaseInfoResponse>(
    `/api/courses/${courseId}?isAdmin=false`,
  );
