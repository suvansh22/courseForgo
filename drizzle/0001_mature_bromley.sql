DROP TABLE `pdf_assets`;--> statement-breakpoint
DROP INDEX `idx_courses_pdf_asset_id`;--> statement-breakpoint
ALTER TABLE `courses` ADD `file_id` text NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_courses_file_id` ON `courses` (`file_id`);--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `pdf_asset_id`;--> statement-breakpoint
ALTER TABLE `purchases` ADD `access_type` text DEFAULT 'read_only' NOT NULL;