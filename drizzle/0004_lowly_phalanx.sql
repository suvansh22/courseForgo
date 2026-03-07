CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`feedback` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_testimonials_active` ON `testimonials` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_testimonials_sort_order` ON `testimonials` (`sort_order`);