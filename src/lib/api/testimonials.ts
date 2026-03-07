import { fetchJson } from "@/lib/http/client";
import type {
  OverwriteTestimonialsInput,
  TestimonialsResponse,
} from "@/types/testimonial";

export const getTestimonials = () =>
  fetchJson<TestimonialsResponse>("/api/testimonials");

export const getAdminTestimonials = () =>
  fetchJson<TestimonialsResponse>("/api/testimonials?isAdmin=true");

export const overwriteAdminTestimonials = (payload: OverwriteTestimonialsInput) =>
  fetchJson<TestimonialsResponse>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
