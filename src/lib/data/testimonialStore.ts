import { getDb } from "@/lib/db/d1";
import { testimonials } from "@/lib/db/schema";
import type {
  CreateTestimonialInput,
  Testimonial,
  TestimonialUpsertInput,
  UpdateTestimonialInput,
} from "@/types/testimonial";
import { asc, desc, eq } from "drizzle-orm";

type TestimonialRow = typeof testimonials.$inferSelect;

const toTestimonial = (row: TestimonialRow): Testimonial => ({
  id: row.id,
  name: row.name,
  feedback: row.feedback,
  isActive: row.isActive,
  sortOrder: row.sortOrder,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const listTestimonials = async (
  activeOnly = false,
): Promise<Testimonial[]> => {
  const db = getDb();
  const whereClause = activeOnly ? eq(testimonials.isActive, true) : undefined;
  const rows = whereClause
    ? await db
        .select()
        .from(testimonials)
        .where(whereClause)
        .orderBy(asc(testimonials.sortOrder), desc(testimonials.updatedAt))
    : await db
        .select()
        .from(testimonials)
        .orderBy(asc(testimonials.sortOrder), desc(testimonials.updatedAt));
  return rows.map(toTestimonial);
};

export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  return row ? toTestimonial(row) : null;
};

export const createTestimonial = async (
  input: CreateTestimonialInput,
): Promise<Testimonial> => {
  const db = getDb();
  const now = new Date().toISOString();
  const testimonial: Testimonial = {
    id: crypto.randomUUID(),
    name: input.name,
    feedback: input.feedback,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(testimonials).values({
    id: testimonial.id,
    name: testimonial.name,
    feedback: testimonial.feedback,
    isActive: testimonial.isActive,
    sortOrder: testimonial.sortOrder,
    createdAt: testimonial.createdAt,
    updatedAt: testimonial.updatedAt,
  });

  return testimonial;
};

export const updateTestimonial = async (
  id: string,
  input: UpdateTestimonialInput,
): Promise<Testimonial | null> => {
  const existing = await getTestimonialById(id);
  if (!existing) return null;

  const values: Partial<typeof testimonials.$inferInsert> = {};
  if (input.name !== undefined) values.name = input.name;
  if (input.feedback !== undefined) values.feedback = input.feedback;
  if (input.isActive !== undefined) values.isActive = input.isActive;
  if (input.sortOrder !== undefined) values.sortOrder = input.sortOrder;

  if (Object.keys(values).length === 0) return existing;

  const updatedAt = new Date().toISOString();
  values.updatedAt = updatedAt;

  const db = getDb();
  await db.update(testimonials).set(values).where(eq(testimonials.id, id));

  return {
    ...existing,
    ...input,
    id,
    updatedAt,
  };
};

export const deleteTestimonial = async (id: string): Promise<Testimonial | null> => {
  const existing = await getTestimonialById(id);
  if (!existing) return null;

  const db = getDb();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  return existing;
};

export const overwriteTestimonials = async (
  input: TestimonialUpsertInput[],
): Promise<Testimonial[]> => {
  const db = getDb();
  const existing = await db.select().from(testimonials);
  const createdAtById = new Map(existing.map((item) => [item.id, item.createdAt]));

  await db.delete(testimonials);

  if (input.length === 0) {
    return [];
  }

  const now = new Date().toISOString();
  const rows: typeof testimonials.$inferInsert[] = input.map((item, index) => {
    const id = item.id?.trim() || crypto.randomUUID();
    return {
      id,
      name: item.name.trim(),
      feedback: item.feedback.trim(),
      isActive: item.isActive ?? true,
      sortOrder: item.sortOrder ?? index,
      createdAt: createdAtById.get(id) ?? now,
      updatedAt: now,
    };
  });

  await db.insert(testimonials).values(rows);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    feedback: row.feedback,
    isActive: row.isActive ?? true,
    sortOrder: row.sortOrder ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
};
