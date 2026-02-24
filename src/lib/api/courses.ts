import { fetchJson } from "@/lib/http/client";
import type { CourseResponse, CoursesResponse } from "@/types/course";

export const getCourses = () => fetchJson<CoursesResponse>("/api/courses");

export const getCourseById = (courseId: string) =>
  fetchJson<CourseResponse>(`/api/courses/${courseId}`);
