CREATE TABLE `wallet_cash_receive` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`grand_total` decimal(24,8) NOT NULL,
	`total_payment` decimal(24,8) NOT NULL,
	`change_amount` decimal(24,8) NOT NULL,
	`payment_method` varchar(255) NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_cash_receive_id` PRIMARY KEY(`id`)
) COMMENT 'Mencatat informasi pembayaran ketika terjadi transaksi top up dan deposit wallet';
--> statement-breakpoint
ALTER TABLE `sales` ADD `created_by` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `wallet_cash_receive_id` bigint unsigned COMMENT 'Relasi dengan table wallet cash receive dan hanya terisi saat transaksi top up dan deposit';--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `deposit_wristband_qty` int unsigned COMMENT 'Mencatat jumlah gelang yang disewa pada saat deposit';--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `created_by` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `wallet_cash_receive` ADD CONSTRAINT `wallet_cash_receive_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD CONSTRAINT `wallet_histories_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD CONSTRAINT `fk_wallet_histories_wallet_cash_receive` FOREIGN KEY (`wallet_cash_receive_id`) REFERENCES `wallet_cash_receive`(`id`) ON DELETE no action ON UPDATE no action;