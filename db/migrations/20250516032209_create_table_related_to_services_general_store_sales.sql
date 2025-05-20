CREATE TABLE `promo_sale_detail` (
	`promo_id` bigint unsigned NOT NULL,
	`sale_detail_id` bigint unsigned NOT NULL,
	`discount_amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `payment_vouchers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`payment_id` bigint unsigned NOT NULL,
	`code` varchar(255) NOT NULL,
	`amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_vouchers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `is_discountable` boolean DEFAULT true NOT NULL AFTER `is_required_tax`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `discount_percent_sale` float DEFAULT 0 NOT NULL AFTER `extras`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `discount_amount_sale` decimal(24,8) DEFAULT '0' NOT NULL AFTER `discount_percent_sale`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `discount_percent_detail` float DEFAULT 0 NOT NULL AFTER `discount_amount_sale`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `discount_amount_detail` decimal(24,8) DEFAULT '0' NOT NULL AFTER `discount_percent_detail`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `tax_percent` float DEFAULT 0 NOT NULL AFTER `discount_amount_detail`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `tax_amount` decimal(24,8) DEFAULT '0' NOT NULL AFTER `tax_percent`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `total_net` decimal(24,8) NOT NULL AFTER `tax_amount`;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `total_final` decimal(24,8) NOT NULL AFTER `total_net`;--> statement-breakpoint
ALTER TABLE `promo_sale_detail` ADD CONSTRAINT `promo_sale_detail_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_sale_detail` ADD CONSTRAINT `promo_sale_detail_sale_detail_id_sales_details_id_fk` FOREIGN KEY (`sale_detail_id`) REFERENCES `sales_details`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_vouchers` ADD CONSTRAINT `payment_vouchers_payment_id_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` DROP COLUMN `payment_method`;--> statement-breakpoint
ALTER TABLE `sales` DROP COLUMN `total_payment`;--> statement-breakpoint
ALTER TABLE `sales` DROP COLUMN `change_amount`;