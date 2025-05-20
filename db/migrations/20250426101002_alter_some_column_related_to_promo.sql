ALTER TABLE `promos` MODIFY COLUMN `is_required_booklet` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `promos` MODIFY COLUMN `is_active` boolean NOT NULL DEFAULT true;