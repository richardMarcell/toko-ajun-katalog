ALTER TABLE `gazebos` ADD `product_id` bigint unsigned NOT NULL AFTER `id`;--> statement-breakpoint
ALTER TABLE `lockers` ADD `product_id` bigint unsigned NOT NULL AFTER `id`;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `is_deposit_wristband_returned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `deposit_wristband_returned_by` bigint unsigned;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD `deposit_wristband_returned_at` timestamp;--> statement-breakpoint
ALTER TABLE `gazebos` ADD CONSTRAINT `gazebos_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lockers` ADD CONSTRAINT `lockers_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_wristband` ADD CONSTRAINT `wallet_wristband_deposit_wristband_returned_by_users_id_fk` FOREIGN KEY (`deposit_wristband_returned_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;