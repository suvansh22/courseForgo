import { getDb } from "@/lib/db/d1";
import { purchases } from "@/lib/db/schema";
import { ACCESS_TYPE, type Purchase } from "@/types/purchase";
import { and, desc, eq } from "drizzle-orm";

type PurchaseRow = typeof purchases.$inferSelect;

const toPurchase = (row: PurchaseRow): Purchase => ({
  id: row.id,
  userId: row.userId,
  courseId: row.courseId,
  accessType:
    row.accessType === ACCESS_TYPE.CAN_DOWNLOAD
      ? ACCESS_TYPE.CAN_DOWNLOAD
      : ACCESS_TYPE.READ_ONLY,
  link: row.link ?? undefined,
  purchasedAt: row.purchasedAt,
});

export const listPurchases = async (): Promise<Purchase[]> => {
  const db = getDb();
  const result = await db
    .select()
    .from(purchases)
    .orderBy(desc(purchases.purchasedAt));
  return result.map(toPurchase);
};

export const listPurchasesByUserId = async (
  userId: string,
): Promise<Purchase[]> => {
  const db = getDb();
  const result = await db
    .select()
    .from(purchases)
    .where(eq(purchases.userId, userId))
    .orderBy(desc(purchases.purchasedAt));
  return result.map(toPurchase);
};

export const getPurchaseByUserAndCourseId = async (
  userId: string,
  courseId: string,
): Promise<Purchase | null> => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(purchases)
    .where(and(eq(purchases.userId, userId), eq(purchases.courseId, courseId)))
    .limit(1);
  return row ? toPurchase(row) : null;
};

export const getPurchaseById = async (id: string): Promise<Purchase | null> => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.id, id))
    .limit(1);
  return row ? toPurchase(row) : null;
};

export const createPurchase = async (
  input: Purchase,
): Promise<Purchase | null> => {
  const db = getDb();
  const existing = await getPurchaseById(input.id);
  if (existing) {
    return null;
  }

  await db.insert(purchases).values({
    id: input.id,
    userId: input.userId,
    courseId: input.courseId,
    accessType: input.accessType,
    link: input.link ?? null,
    purchasedAt: input.purchasedAt,
  });

  return input;
};
