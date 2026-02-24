import { getDb } from "@/lib/db/d1";
import { pdfAssets } from "@/lib/db/schema";
import type { PdfAsset } from "@/types/pdfAsset";
import { desc, eq } from "drizzle-orm";

type PdfAssetRow = typeof pdfAssets.$inferSelect;

const toPdfAsset = (row: PdfAssetRow): PdfAsset => ({
  id: row.id,
  storageKey: row.storageKey,
  originalName: row.originalName,
  sizeBytes: row.sizeBytes,
  mimeType: "application/pdf",
  checksum: row.checksum ?? undefined,
  pages: row.pages ?? undefined,
  uploadedByUserId: row.uploadedByUserId,
  uploadedAt: row.uploadedAt,
});

export const listPdfAssets = async (): Promise<PdfAsset[]> => {
  const db = getDb();
  const result = await db
    .select()
    .from(pdfAssets)
    .orderBy(desc(pdfAssets.uploadedAt));
  return result.map(toPdfAsset);
};

export const getPdfAssetById = async (
  id: string,
): Promise<PdfAsset | null> => {
  const db = getDb();
  const [row] = await db
    .select()
    .from(pdfAssets)
    .where(eq(pdfAssets.id, id))
    .limit(1);
  return row ? toPdfAsset(row) : null;
};

export const createPdfAsset = async (input: PdfAsset): Promise<PdfAsset | null> => {
  const db = getDb();
  const existing = await getPdfAssetById(input.id);
  if (existing) {
    return null;
  }

  await db.insert(pdfAssets).values({
    id: input.id,
    storageKey: input.storageKey,
    originalName: input.originalName,
    sizeBytes: input.sizeBytes,
    mimeType: input.mimeType,
    checksum: input.checksum ?? null,
    pages: input.pages ?? null,
    uploadedByUserId: input.uploadedByUserId,
    uploadedAt: input.uploadedAt,
  });

  return input;
};

export const updatePdfAsset = async (
  id: string,
  update: Partial<PdfAsset>,
): Promise<PdfAsset | null> => {
  const existing = await getPdfAssetById(id);
  if (!existing) {
    return null;
  }

  const values: Partial<typeof pdfAssets.$inferInsert> = {};

  if (update.storageKey !== undefined) values.storageKey = update.storageKey;
  if (update.originalName !== undefined) values.originalName = update.originalName;
  if (update.sizeBytes !== undefined) values.sizeBytes = update.sizeBytes;
  if (update.mimeType !== undefined) values.mimeType = update.mimeType;
  if (update.checksum !== undefined) values.checksum = update.checksum ?? null;
  if (update.pages !== undefined) values.pages = update.pages ?? null;
  if (update.uploadedByUserId !== undefined) values.uploadedByUserId = update.uploadedByUserId;
  if (update.uploadedAt !== undefined) values.uploadedAt = update.uploadedAt;

  if (Object.keys(values).length === 0) {
    return existing;
  }

  const db = getDb();
  await db.update(pdfAssets).set(values).where(eq(pdfAssets.id, id));

  return {
    ...existing,
    ...update,
    id,
  } as PdfAsset;
};

export const deletePdfAsset = async (id: string): Promise<PdfAsset | null> => {
  const existing = await getPdfAssetById(id);
  if (!existing) {
    return null;
  }

  const db = getDb();
  await db.delete(pdfAssets).where(eq(pdfAssets.id, id));
  return existing;
};
