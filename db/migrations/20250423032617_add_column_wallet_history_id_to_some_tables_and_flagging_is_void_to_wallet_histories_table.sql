ALTER TABLE `wallets` DROP FOREIGN KEY `wallets_voided_by_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD `wallet_history_id` bigint unsigned NOT NULL AFTER `gazebo_id`;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD `wallet_history_id` bigint unsigned NOT NULL AFTER `locker_id`;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `is_void` boolean DEFAULT false AFTER `deposit_wristband_qty`;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `voided_by` bigint unsigned AFTER `is_void`;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `voided_at` timestamp AFTER `voided_by`;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `wallet_history_id` bigint unsigned NOT NULL AFTER `wristband_code`;--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD CONSTRAINT `gazebo_wallet_wallet_history_id_wallet_histories_id_fk` FOREIGN KEY (`wallet_history_id`) REFERENCES `wallet_histories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD CONSTRAINT `locker_wallet_wallet_history_id_wallet_histories_id_fk` FOREIGN KEY (`wallet_history_id`) REFERENCES `wallet_histories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD CONSTRAINT `wallet_histories_voided_by_users_id_fk` FOREIGN KEY (`voided_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD CONSTRAINT `wallet_wristband_wallet_history_id_wallet_histories_id_fk` FOREIGN KEY (`wallet_history_id`) REFERENCES `wallet_histories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `is_void`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `voided_by`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `voided_at`;