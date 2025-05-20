CREATE TABLE `wallet_histories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`wallet_id` bigint unsigned NOT NULL,
	`sale_id` bigint unsigned,
	`transaction_type` varchar(225) NOT NULL,
	`prev_saldo` decimal(24,8) NOT NULL,
	`current_saldo` decimal(24,8) NOT NULL,
	`amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_histories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallet_wristband` (
	`wallet_id` bigint unsigned NOT NULL,
	`wristband_code` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `wallets` RENAME COLUMN `consumer_name` TO `customer_name`;--> statement-breakpoint
ALTER TABLE `wallets` RENAME COLUMN `consumer_phone_number` TO `customer_phone_number`;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD CONSTRAINT `wallet_histories_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD CONSTRAINT `wallet_histories_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD CONSTRAINT `wallet_wristband_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD CONSTRAINT `wallet_wristband_wristband_code_wristbands_code_fk` FOREIGN KEY (`wristband_code`) REFERENCES `wristbands`(`code`) ON DELETE restrict ON UPDATE no action;