CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`original_price` integer NOT NULL,
	`discounted_price` integer,
	`thumbnail_url` text,
	`pdf_asset_id` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_courses_active` ON `courses` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_courses_pdf_asset_id` ON `courses` (`pdf_asset_id`);--> statement-breakpoint
CREATE TABLE `pdf_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`storage_key` text NOT NULL,
	`original_name` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`mime_type` text NOT NULL,
	`checksum` text,
	`pages` integer,
	`uploaded_by_user_id` text NOT NULL,
	`uploaded_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pdf_assets_storage_key_unique_idx` ON `pdf_assets` (`storage_key`);--> statement-breakpoint
CREATE INDEX `pdf_assets_uploaded_by_user_idx` ON `pdf_assets` (`uploaded_by_user_id`);--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`purchased_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_user_course_unique_idx` ON `purchases` (`user_id`,`course_id`);--> statement-breakpoint
CREATE INDEX `idx_purchases_user_id` ON `purchases` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_purchases_course_id` ON `purchases` (`course_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique_idx` ON `users` (`email`);