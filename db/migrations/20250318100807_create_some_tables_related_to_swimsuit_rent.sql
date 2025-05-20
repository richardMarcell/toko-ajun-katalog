CREATE TABLE `sales_detail_swimsuit_rent` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_detail_id` bigint unsigned NOT NULL,
	`return_status` varchar(255) NOT NULL DEFAULT 'NOT RETURNED',
	`returned_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_detail_swimsuit_rent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_swimsuit_rent` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`wristband_code` varchar(255) NOT NULL,
	`order_number` varchar(255) NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`customer_phone_number` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_swimsuit_rent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock_swimsuit_rent` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned,
	`qty` int unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_swimsuit_rent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `code` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `ssr_penalty` decimal(24,8);--> statement-breakpoint
ALTER TABLE `products` ADD `is_rentable` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `sales` ADD `transaction_type` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_code_unique` UNIQUE(`code`);--> statement-breakpoint
ALTER TABLE `sales_detail_swimsuit_rent` ADD CONSTRAINT `sales_detail_swimsuit_rent_sales_detail_id_sales_details_id_fk` FOREIGN KEY (`sales_detail_id`) REFERENCES `sales_details`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_swimsuit_rent` ADD CONSTRAINT `sales_swimsuit_rent_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_swimsuit_rent` ADD CONSTRAINT `sales_swimsuit_rent_wristband_code_wristbands_code_fk` FOREIGN KEY (`wristband_code`) REFERENCES `wristbands`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_swimsuit_rent` ADD CONSTRAINT `stock_swimsuit_rent_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;