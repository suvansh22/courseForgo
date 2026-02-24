import { getDb } from "@/lib/db/d1";
import { users } from "@/lib/db/schema";
import type { User } from "@/types/user";
import { desc, eq } from "drizzle-orm";

type UserRow = typeof users.$inferSelect;

const toUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const listUsers = async (): Promise<User[]> => {
  const db = getDb();
  const result = await db.select().from(users).orderBy(desc(users.createdAt));
  return result.map(toUser);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ? toUser(row) : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return row ? toUser(row) : null;
};

export const createUser = async (input: User): Promise<User | null> => {
  const db = getDb();
  const existing = await getUserById(input.id);
  if (existing) {
    return null;
  }

  await db.insert(users).values({
    id: input.id,
    email: input.email,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  });

  return input;
};
