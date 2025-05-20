ALTER TABLE `gazebo_wallet` ADD `return_status` varchar(255) DEFAULT 'NOT RETURNED' NOT NULL AFTER `payment_status`;--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD `returned_at` timestamp AFTER `return_status`;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD `return_status` varchar(255) DEFAULT 'NOT RETURNED' NOT NULL AFTER `payment_status`;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD `returned_at` timestamp AFTER `return_status`;--> statement-breakpoint
ALTER TABLE `sales_detail_swimsuit_rent` ADD `wallet_id` bigint unsigned AFTER `sales_detail_id`;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `return_status` varchar(255) DEFAULT 'RENTED' NOT NULL AFTER `status`;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `returned_at` timestamp AFTER `return_status`;--> statement-breakpoint
ALTER TABLE `sales_detail_swimsuit_rent` ADD CONSTRAINT `sales_detail_swimsuit_rent_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;