import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/lib/db/schema";

export const getDb = () => {
  const context = getCloudflareContext();
  const db = (context?.env as { DB?: unknown } | undefined)?.DB;

  if (!db) {
    throw new Error("D1 database binding 'DB' is not configured.");
  }

  return drizzle(db as never, { schema });
};
