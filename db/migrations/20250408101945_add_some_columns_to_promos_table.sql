ALTER TABLE `booklets` MODIFY COLUMN `is_active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `promos` ADD `is_active` boolean DEFAULT true AFTER `is_required_booklet`;--> statement-breakpoint
ALTER TABLE `promos` ADD `periode_start` date NOT NULL AFTER `is_active`;--> statement-breakpoint
ALTER TABLE `promos` ADD `periode_end` date NOT NULL AFTER `periode_start`;