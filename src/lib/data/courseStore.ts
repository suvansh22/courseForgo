import { getDb } from "@/lib/db/d1";
import { courses } from "@/lib/db/schema";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/types/course";
import { desc, eq } from "drizzle-orm";

type CourseRow = typeof courses.$inferSelect;

const toCourse = (row: CourseRow): Course => ({
  id: row.id,
  title: row.title,
  description: row.description,
  originalPrice: row.originalPrice,
  discountedPrice: row.discountedPrice ?? undefined,
  thumbnailUrl: row.thumbnailUrl ?? undefined,
  pdfAssetId: row.pdfAssetId,
  isActive: row.isActive,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const listCourses = async (): Promise<Course[]> => {
  const db = getDb();
  const result = await db.select().from(courses).orderBy(desc(courses.createdAt));
  return result.map(toCourse);
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const db = getDb();
  const [row] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return row ? toCourse(row) : null;
};

export const createCourse = async (
  input: CreateCourseInput,
): Promise<Course | null> => {
  const db = getDb();
  const existing = await getCourseById(input.id);
  if (existing) {
    return null;
  }

  const now = new Date().toISOString();
  const course: Course = {
    ...input,
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(courses).values({
    id: course.id,
    title: course.title,
    description: course.description,
    originalPrice: course.originalPrice,
    discountedPrice: course.discountedPrice ?? null,
    thumbnailUrl: course.thumbnailUrl ?? null,
    pdfAssetId: course.pdfAssetId,
    isActive: course.isActive,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  });

  return course;
};

export const updateCourse = async (
  id: string,
  input: UpdateCourseInput,
): Promise<Course | null> => {
  const existing = await getCourseById(id);
  if (!existing) {
    return null;
  }

  const values: Partial<typeof courses.$inferInsert> = {};

  if (input.title !== undefined) values.title = input.title;
  if (input.description !== undefined) values.description = input.description;
  if (input.originalPrice !== undefined) values.originalPrice = input.originalPrice;
  if (input.discountedPrice !== undefined) values.discountedPrice = input.discountedPrice ?? null;
  if (input.thumbnailUrl !== undefined) values.thumbnailUrl = input.thumbnailUrl ?? null;
  if (input.pdfAssetId !== undefined) values.pdfAssetId = input.pdfAssetId;
  if (input.isActive !== undefined) values.isActive = input.isActive;

  if (Object.keys(values).length === 0) {
    return existing;
  }

  const updatedAt = new Date().toISOString();
  values.updatedAt = updatedAt;

  const db = getDb();
  await db.update(courses).set(values).where(eq(courses.id, id));

  return {
    ...existing,
    ...input,
    id,
    updatedAt,
  };
};

export const deleteCourse = async (id: string): Promise<Course | null> => {
  const existing = await getCourseById(id);
  if (!existing) {
    return null;
  }

  const db = getDb();
  await db.delete(courses).where(eq(courses.id, id));
  return existing;
};
