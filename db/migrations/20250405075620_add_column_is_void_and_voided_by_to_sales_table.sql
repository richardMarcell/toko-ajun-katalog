ALTER TABLE `sales` ADD `is_void` boolean DEFAULT false AFTER `change_amount`;--> statement-breakpoint
ALTER TABLE `sales` ADD `voided_by` bigint unsigned AFTER `is_void`;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_voided_by_users_id_fk` FOREIGN KEY (`voided_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;