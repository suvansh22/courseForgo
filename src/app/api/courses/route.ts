import { requireAuth } from "@/lib/auth/requireAuth";
import { createCourse, listCourses } from "@/lib/data/courseStore";
import { listPurchasesByUserId } from "@/lib/data/purchaseStore";
import {
  conflict,
  hasSession,
  invalidJson,
  serverError,
  unauthorized,
  validationFailed,
} from "@/lib/http/apiErrors";
import { validateCreateCourse } from "@/lib/validation/course";
import type {
  CourseResponse,
  CoursesResponse,
  CoursesWithPurchaseInfoResponse,
} from "@/types/course";
import { NextResponse } from "next/server";

export const isAdminQueryFalse = (request: Request) =>
  new URL(request.url).searchParams.get("isAdmin")?.toLowerCase() === "false";

export const GET = async (request: Request) => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const courses = await listCourses();
    if (isAdminQueryFalse(request)) {
      const userPurchases = await listPurchasesByUserId(session.user.id);
      const purchasesByCourseId = new Map(
        userPurchases.map((purchase) => [purchase.courseId, purchase]),
      );

      const coursesWithPurchaseInfo = courses.map((course) => {
        const purchase = purchasesByCourseId.get(course.id);
        return {
          ...course,
          purchaseInfo: {
            hasPurchased: Boolean(purchase),
            accessType: purchase?.accessType,
            purchasedAt: purchase?.purchasedAt,
          },
        };
      });

      return NextResponse.json<CoursesWithPurchaseInfoResponse>({
        courses: coursesWithPurchaseInfo,
      });
    }

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

    return NextResponse.json<CourseResponse>(
      { course: created },
      { status: 201 },
    );
  } catch (error) {
    return serverError(error, "Failed to create course.");
  }
};
