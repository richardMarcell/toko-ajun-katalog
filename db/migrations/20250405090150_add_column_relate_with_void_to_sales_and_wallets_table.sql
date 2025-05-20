ALTER TABLE `sales` ADD `voided_at` timestamp AFTER `voided_by`;--> statement-breakpoint
ALTER TABLE `wallets` ADD `is_void` boolean DEFAULT false AFTER `status`;--> statement-breakpoint
ALTER TABLE `wallets` ADD `voided_by` bigint unsigned AFTER `is_void`;--> statement-breakpoint
ALTER TABLE `wallets` ADD `voided_at` timestamp AFTER `voided_by`;--> statement-breakpoint
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_voided_by_users_id_fk` FOREIGN KEY (`voided_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;