import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  usersEmailUniqueIdx: uniqueIndex("users_email_unique_idx").on(table.email),
}));

export const pdfAssets = sqliteTable("pdf_assets", {
  id: text("id").primaryKey(),
  storageKey: text("storage_key").notNull(),
  originalName: text("original_name").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  mimeType: text("mime_type").notNull(),
  checksum: text("checksum"),
  pages: integer("pages"),
  uploadedByUserId: text("uploaded_by_user_id").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
}, (table) => ({
  pdfAssetsStorageKeyUniqueIdx: uniqueIndex("pdf_assets_storage_key_unique_idx").on(table.storageKey),
  pdfAssetsUploadedByUserIdx: index("pdf_assets_uploaded_by_user_idx").on(table.uploadedByUserId),
}));

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  originalPrice: integer("original_price").notNull(),
  discountedPrice: integer("discounted_price"),
  thumbnailUrl: text("thumbnail_url"),
  pdfAssetId: text("pdf_asset_id").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  coursesActiveIdx: index("idx_courses_active").on(table.isActive),
  coursesPdfAssetIdx: index("idx_courses_pdf_asset_id").on(table.pdfAssetId),
}));

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull(),
  purchasedAt: text("purchased_at").notNull(),
}, (table) => ({
  purchasesUserCourseUniqueIdx: uniqueIndex("purchases_user_course_unique_idx").on(table.userId, table.courseId),
  purchasesUserIdx: index("idx_purchases_user_id").on(table.userId),
  purchasesCourseIdx: index("idx_purchases_course_id").on(table.courseId),
}));
