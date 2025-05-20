CREATE TABLE `promo_sale` (
	`promo_id` bigint unsigned NOT NULL,
	`sale_id` bigint unsigned NOT NULL,
	`discount_amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `status` varchar(255) DEFAULT 'OPEN' NOT NULL;--> statement-breakpoint
ALTER TABLE `promo_sale` ADD CONSTRAINT `promo_sale_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_sale` ADD CONSTRAINT `promo_sale_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;