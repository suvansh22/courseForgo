import { requireAuth } from "@/lib/auth/requireAuth";
import {
  listTestimonials,
  overwriteTestimonials,
} from "@/lib/data/testimonialStore";
import {
  hasSession,
  invalidJson,
  serverError,
  unauthorized,
  validationFailed,
} from "@/lib/http/apiErrors";
import { validateOverwriteTestimonials } from "@/lib/validation/testimonial";
import type { TestimonialsResponse } from "@/types/testimonial";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const isAdminView =
      new URL(request.url).searchParams.get("isAdmin")?.toLowerCase() ===
      "true";

    if (isAdminView) {
      const session = await requireAuth();
      if (!hasSession(session)) return unauthorized();
    }
    const testimonials = await listTestimonials(!isAdminView);
    return NextResponse.json<TestimonialsResponse>({ testimonials });
  } catch (error) {
    return serverError(error, "Failed to load testimonials.");
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

    const { errors, data } = validateOverwriteTestimonials(payload);
    if (errors) return validationFailed(errors);

    const testimonials = await overwriteTestimonials(data!.testimonials);
    return NextResponse.json<TestimonialsResponse>({ testimonials });
  } catch (error) {
    return serverError(error, "Failed to save testimonials.");
  }
};
