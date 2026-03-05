ALTER TABLE `courses` RENAME COLUMN "original_price" TO "read_price";--> statement-breakpoint
ALTER TABLE `courses` RENAME COLUMN "discounted_price" TO "read_discounted_price";--> statement-breakpoint
ALTER TABLE `courses` ADD `download_price` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `download_discounted_price` integer;