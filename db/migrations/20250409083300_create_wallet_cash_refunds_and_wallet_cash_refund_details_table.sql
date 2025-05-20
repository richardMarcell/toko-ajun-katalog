CREATE TABLE `wallet_cash_refund_details` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`wallet_cash_refund_id` bigint unsigned,
	`item_name` varchar(255) NOT NULL,
	`item_product_id` bigint unsigned NOT NULL,
	`item_qty` int unsigned DEFAULT 0,
	`subtotal` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_cash_refund-details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallet_cash_refunds` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`total_refund` decimal(24,8) NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_cash_refunds_id` PRIMARY KEY(`id`)
) COMMENT 'Mencatat informasi pengambalian uang ketika terjadi pengembalian gelang';
--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `id` bigint unsigned NOT NULL FIRST;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD CONSTRAINT `wallet_wristband_pk` PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `wallet_wristband` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `wallet_histories` ADD `wallet_cash_refund_id` bigint unsigned AFTER `wallet_cash_receive_id`;--> statement-breakpoint
ALTER TABLE `wallet_cash_refunds` ADD CONSTRAINT `wallet_cash_refunds_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;