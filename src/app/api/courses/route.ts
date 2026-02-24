import { requireAuth } from "@/lib/auth/requireAuth";
import { createCourse, listCourses } from "@/lib/data/courseStore";
import { createPdfAsset, deletePdfAsset } from "@/lib/data/pdfAssetStore";
import { createUser, getUserById } from "@/lib/data/userStore";
import {
  conflict,
  hasSession,
  invalidJson,
  serverError,
  validationFailed,
  badRequest,
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

    const { errors, course, pdfAsset } = validateCreateCourse(payload);
    if (errors) {
      return validationFailed(errors);
    }

    const existingUser = await getUserById(session.user.id);
    if (!existingUser) {
      if (!session.user.email) {
        return badRequest(
          "Authenticated user email is required to create course assets.",
        );
      }

      await createUser({
        id: session.user.id,
        email: session.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const createdPdf = await createPdfAsset({
      ...pdfAsset,
      uploadedByUserId: session.user.id,
      uploadedAt: new Date().toISOString(),
    });
    if (!createdPdf) {
      return conflict("PDF asset with this id already exists.");
    }

    const created = await createCourse(course!);
    if (!created) {
      await deletePdfAsset(pdfAsset!.id);
      return conflict("Course with this id already exists.");
    }

    return NextResponse.json<CourseResponse>({ course: created }, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create course.");
  }
};
