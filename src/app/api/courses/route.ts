import { requireAuth } from "@/lib/auth/requireAuth";
import { createCourse, listCourses } from "@/lib/data/courseStore";
import {
  conflict,
  hasSession,
  invalidJson,
  serverError,
  validationFailed,
  unauthorized,
} from "@/lib/http/apiErrors";
import type { CourseResponse, CoursesResponse } from "@/types/course";
import { validateCreateCourse } from "@/lib/validation/course";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const courses = await listCourses();
    return NextResponse.json<CoursesResponse>({ courses });
  } catch (error) {
    return serverError(error, "Failed to load courses.");
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return invalidJson();
    }

    const { errors, course } = validateCreateCourse(payload);
    if (errors) {
      return validationFailed(errors);
    }

    const created = await createCourse(course!);
    if (!created) {
      return conflict("Course with this id already exists.");
    }

    return NextResponse.json<CourseResponse>({ course: created }, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create course.");
  }
};
