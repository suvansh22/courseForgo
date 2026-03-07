import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    usersEmailUniqueIdx: uniqueIndex("users_email_unique_idx").on(table.email),
  }),
);

export const courses = sqliteTable(
  "courses",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    readPrice: integer("read_price").notNull(),
    readDiscountedPrice: integer("read_discounted_price"),
    downloadPrice: integer("download_price").notNull(),
    downloadDiscountedPrice: integer("download_discounted_price"),
    thumbnailUrl: text("thumbnail_url"),
    fileId: text("file_id").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    coursesActiveIdx: index("idx_courses_active").on(table.isActive),
    coursesFileIdIdx: index("idx_courses_file_id").on(table.fileId),
  }),
);

export const purchases = sqliteTable(
  "purchases",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    courseId: text("course_id").notNull(),
    accessType: text("access_type", {
      enum: ["read_only", "can_download"],
    })
      .notNull()
      .default("read_only"),
    link: text("link"),
    purchasedAt: text("purchased_at").notNull(),
  },
  (table) => ({
    purchasesUserCourseUniqueIdx: uniqueIndex(
      "purchases_user_course_unique_idx",
    ).on(table.userId, table.courseId),
    purchasesUserIdx: index("idx_purchases_user_id").on(table.userId),
    purchasesCourseIdx: index("idx_purchases_course_id").on(table.courseId),
  }),
);

export const testimonials = sqliteTable(
  "testimonials",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    feedback: text("feedback").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    testimonialsActiveIdx: index("idx_testimonials_active").on(table.isActive),
    testimonialsSortIdx: index("idx_testimonials_sort_order").on(table.sortOrder),
  }),
);
