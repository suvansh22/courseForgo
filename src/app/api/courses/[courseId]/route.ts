import { requireAuth } from "@/lib/auth/requireAuth";
import { deleteCourse, getCourseById, updateCourse } from "@/lib/data/courseStore";
import {
  hasSession,
  invalidJson,
  notFound,
  serverError,
  validationFailed,
  badRequest,
  unauthorized,
} from "@/lib/http/apiErrors";
import type { CourseResponse } from "@/types/course";
import { validateUpdateCourse } from "@/lib/validation/course";
import { NextResponse } from "next/server";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    const { courseId } = await params;

    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const course = await getCourseById(courseId);
    if (!course) {
      return notFound("Course not found.");
    }

    return NextResponse.json<CourseResponse>({ course });
  } catch (error) {
    return serverError(error, "Failed to load course.");
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    const { courseId } = await params;

    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const existing = await getCourseById(courseId);
    if (!existing) {
      return notFound("Course not found.");
    }

    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return invalidJson();
    }

    const { errors, update } = validateUpdateCourse(payload);
    if (errors) {
      return validationFailed(errors);
    }

    if (update?.id && update.id !== courseId) {
      return badRequest("Course id in body must match route param.");
    }

    const updated = await updateCourse(courseId, update ?? {});
    if (!updated) {
      return notFound("Course not found.");
    }

    return NextResponse.json<CourseResponse>({ course: updated });
  } catch (error) {
    return serverError(error, "Failed to update course.");
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    const { courseId } = await params;

    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const deleted = await deleteCourse(courseId);
    if (!deleted) {
      return notFound("Course not found.");
    }

    return NextResponse.json<CourseResponse>({ course: deleted });
  } catch (error) {
    return serverError(error, "Failed to delete course.");
  }
};
