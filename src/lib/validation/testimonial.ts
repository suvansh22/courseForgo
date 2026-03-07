import type {
  CreateTestimonialInput,
  OverwriteTestimonialsInput,
  TestimonialUpsertInput,
  UpdateTestimonialInput,
} from "@/types/testimonial";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value);

export const validateCreateTestimonial = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const name = payload.name;
  const feedback = payload.feedback;
  const isActive = payload.isActive;
  const sortOrder = payload.sortOrder;

  if (!isNonEmptyString(name)) errors.push("name is required.");
  if (!isNonEmptyString(feedback)) errors.push("feedback is required.");
  if (isActive !== undefined && !isBoolean(isActive)) {
    errors.push("isActive must be a boolean when provided.");
  }
  if (sortOrder !== undefined && !isInteger(sortOrder)) {
    errors.push("sortOrder must be an integer when provided.");
  }

  if (errors.length > 0) return { errors };

  const safeName = isNonEmptyString(name) ? name.trim() : "";
  const safeFeedback = isNonEmptyString(feedback) ? feedback.trim() : "";

  const testimonial: CreateTestimonialInput = {
    name: safeName,
    feedback: safeFeedback,
    isActive: isBoolean(isActive) ? isActive : undefined,
    sortOrder: isInteger(sortOrder) ? sortOrder : undefined,
  };

  return { testimonial };
};

export const validateUpdateTestimonial = (payload: Record<string, unknown>) => {
  const errors: string[] = [];
  const name = payload.name;
  const feedback = payload.feedback;
  const isActive = payload.isActive;
  const sortOrder = payload.sortOrder;

  if (name !== undefined && !isNonEmptyString(name)) {
    errors.push("name must be a non-empty string when provided.");
  }
  if (feedback !== undefined && !isNonEmptyString(feedback)) {
    errors.push("feedback must be a non-empty string when provided.");
  }
  if (isActive !== undefined && !isBoolean(isActive)) {
    errors.push("isActive must be a boolean when provided.");
  }
  if (sortOrder !== undefined && !isInteger(sortOrder)) {
    errors.push("sortOrder must be an integer when provided.");
  }

  if (errors.length > 0) return { errors };

  const update: UpdateTestimonialInput = {
    ...(isNonEmptyString(name) ? { name: name.trim() } : {}),
    ...(isNonEmptyString(feedback) ? { feedback: feedback.trim() } : {}),
    ...(isBoolean(isActive) ? { isActive } : {}),
    ...(isInteger(sortOrder) ? { sortOrder } : {}),
  };

  return { update };
};

export const validateOverwriteTestimonials = (
  payload: Record<string, unknown>,
) => {
  const errors: string[] = [];
  const rawTestimonials = payload.testimonials;

  if (!Array.isArray(rawTestimonials)) {
    return { errors: ["testimonials must be an array."] };
  }

  const testimonials: TestimonialUpsertInput[] = [];

  rawTestimonials.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`testimonials[${index}] must be an object.`);
      return;
    }

    const entry = item as Record<string, unknown>;
    const id = entry.id;
    const name = entry.name;
    const feedback = entry.feedback;
    const isActive = entry.isActive;
    const sortOrder = entry.sortOrder;

    if (id !== undefined && !isNonEmptyString(id)) {
      errors.push(`testimonials[${index}].id must be a non-empty string.`);
    }
    if (!isNonEmptyString(name)) {
      errors.push(`testimonials[${index}].name is required.`);
    }
    if (!isNonEmptyString(feedback)) {
      errors.push(`testimonials[${index}].feedback is required.`);
    }
    if (isActive !== undefined && !isBoolean(isActive)) {
      errors.push(`testimonials[${index}].isActive must be boolean.`);
    }
    if (sortOrder !== undefined && !isInteger(sortOrder)) {
      errors.push(`testimonials[${index}].sortOrder must be an integer.`);
    }

    if (isNonEmptyString(name) && isNonEmptyString(feedback)) {
      testimonials.push({
        ...(isNonEmptyString(id) ? { id: id.trim() } : {}),
        name: name.trim(),
        feedback: feedback.trim(),
        ...(isBoolean(isActive) ? { isActive } : {}),
        ...(isInteger(sortOrder) ? { sortOrder } : {}),
      });
    }
  });

  if (errors.length > 0) return { errors };

  const data: OverwriteTestimonialsInput = { testimonials };
  return { data };
};
