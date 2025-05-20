CREATE TABLE `wallet_ticket_sale` (
	`wallet_id` bigint unsigned NOT NULL,
	`ticket_sale_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
ALTER TABLE `promo_sale` RENAME COLUMN `sale_id` TO `sales_id`;--> statement-breakpoint
ALTER TABLE `sales_details` RENAME COLUMN `is_journal_transaction` TO `is_send_to_scm`;--> statement-breakpoint
ALTER TABLE `promo_sale` DROP FOREIGN KEY `promo_sale_sale_id_sales_id_fk`;
--> statement-breakpoint
ALTER TABLE `sales_details` ADD `subject_to_tax` boolean DEFAULT true AFTER `is_send_to_scm`;--> statement-breakpoint
ALTER TABLE `wallet_ticket_sale` ADD CONSTRAINT `wallet_ticket_sale_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_ticket_sale` ADD CONSTRAINT `wallet_ticket_sale_ticket_sale_id_sales_id_fk` FOREIGN KEY (`ticket_sale_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_sale` ADD CONSTRAINT `promo_sale_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;