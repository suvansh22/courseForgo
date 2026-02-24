import { requireAuth } from "@/lib/auth/requireAuth";
import { createPurchase, listPurchases } from "@/lib/data/purchaseStore";
import { getCourseById } from "@/lib/data/courseStore";
import { getUserById } from "@/lib/data/userStore";
import {
  conflict,
  hasSession,
  invalidJson,
  notFound,
  serverError,
  unauthorized,
  validationFailed,
} from "@/lib/http/apiErrors";
import type { PurchaseResponse, PurchasesResponse } from "@/types/purchase";
import { validateCreatePurchase } from "@/lib/validation/purchase";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const purchases = await listPurchases();
    return NextResponse.json<PurchasesResponse>({ purchases });
  } catch (error) {
    return serverError(error, "Failed to load purchases.");
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

    const { errors, purchase } = validateCreatePurchase(payload);
    if (errors) {
      return validationFailed(errors);
    }

    const [user, course] = await Promise.all([
      getUserById(purchase!.userId),
      getCourseById(purchase!.courseId),
    ]);
    if (!user) {
      return notFound("User not found.");
    }
    if (!course) {
      return notFound("Course not found.");
    }

    const created = await createPurchase(purchase!);
    if (!created) {
      return conflict("Purchase with this id already exists.");
    }

    return NextResponse.json<PurchaseResponse>({ purchase: created }, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create purchase.");
  }
};
