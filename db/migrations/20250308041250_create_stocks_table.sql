CREATE TABLE `stocks` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned,
	`warehouse_id` varchar(255),
	`qty` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sales_food_corner` RENAME COLUMN `nama_pelanggan` TO `customer_name`;--> statement-breakpoint
ALTER TABLE `products`
  ADD `stock_type` varchar(255) NOT NULL COMMENT 'Menyimpan tipe produk dengan nilai STOCK atau NON STOCK' AFTER `image`;--> statement-breakpoint
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `unit`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `qty`;