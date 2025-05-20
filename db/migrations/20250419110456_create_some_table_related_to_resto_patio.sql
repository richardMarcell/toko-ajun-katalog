CREATE TABLE `captain_order_details` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`captain_order_id` bigint unsigned NOT NULL,
	`product_id` bigint unsigned NOT NULL,
	`warehouse_id` varchar(255) NOT NULL,
	`qty` int unsigned NOT NULL,
	`paid_qty` int unsigned NOT NULL,
	`price` decimal(24,8) NOT NULL,
	`subtotal` decimal(24,8) NOT NULL,
	`note` longtext,
	`extras` json COMMENT 'Menampung atribut tambahan untuk item special di resto',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `captain_order_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `captain_orders` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`promo_id` bigint unsigned,
	`table_id` bigint unsigned NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`code` varchar(255) NOT NULL,
	`outlet` varchar(255) NOT NULL,
	`meal_time` varchar(255) NOT NULL,
	`compliment` varchar(255) NOT NULL,
	`order_type` varchar(255) NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`customer_adult_count` int unsigned NOT NULL,
	`customer_child_count` int unsigned NOT NULL,
	`discount_amount` decimal(24,8) NOT NULL,
	`discount_percent` float NOT NULL,
	`tax_amount` decimal(24,8) NOT NULL,
	`tax_percent` float NOT NULL,
	`total_gross` decimal(24,8) NOT NULL,
	`total_net` decimal(24,8) NOT NULL,
	`grand_total` decimal(24,8) NOT NULL,
	`is_closed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `captain_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `category` TO `product_category_id`;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `product_category_id` bigint unsigned NOT NULL AFTER `fc_tenant_id`;--> statement-breakpoint
ALTER TABLE `tables` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` ADD `captain_order_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `sales_details` ADD `extras` json COMMENT 'Menampung atribut tambahan untuk item special di resto';--> statement-breakpoint
ALTER TABLE `tables` ADD `status` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `captain_order_details` ADD CONSTRAINT `captain_order_details_captain_order_id_captain_orders_id_fk` FOREIGN KEY (`captain_order_id`) REFERENCES `captain_orders`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `captain_order_details` ADD CONSTRAINT `captain_order_details_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD CONSTRAINT `captain_orders_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD CONSTRAINT `captain_orders_table_id_tables_id_fk` FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD CONSTRAINT `captain_orders_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_product_category_id_product_categories_id_fk` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_captain_order_id_captain_orders_id_fk` FOREIGN KEY (`captain_order_id`) REFERENCES `captain_orders`(`id`) ON DELETE restrict ON UPDATE no action;