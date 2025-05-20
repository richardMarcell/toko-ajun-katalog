CREATE TABLE `products` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`fc_tenant_id` bigint unsigned COMMENT 'Relasi dengan table tenants dan hanya digunakan di food corner',
	`unit` varchar(255) NOT NULL,
	`qty` int NOT NULL DEFAULT 0,
	`price` decimal(24,8) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255),
	`description` longtext NOT NULL,
	`image` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);

--> statement-breakpoint
CREATE TABLE `sales` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`discount_amount` decimal(24,8) NOT NULL,
	`discount_percent` float NOT NULL,
	`sales_status` varchar(255) NOT NULL DEFAULT 'OPEN',
	`tax_amount` decimal(24,8) NOT NULL,
	`tax_percent` float NOT NULL,
	`total_gross` decimal(24,8) NOT NULL,
	`total_net` decimal(24,8) NOT NULL,
	`grand_total` decimal(24,8) NOT NULL,
	`unit` varchar(255) NOT NULL,
	`payment_method` varchar(255) NOT NULL,
	`total_payment` decimal(24,8) NOT NULL,
	`change_amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `sales_details` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`product_id` bigint unsigned NOT NULL,
	`order_status` varchar(255) NOT NULL DEFAULT 'PREPARING',
	`note` longtext,
	`qty` int NOT NULL DEFAULT 0,
	`price` decimal(24,8) NOT NULL,
	`subtotal` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_food_corner` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`order_number` varchar(255) NOT NULL,
	`table_number` varchar(5) NOT NULL,
	`nama_pelanggan` varchar(255) NOT NULL,
	`order_type` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_food_corner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_temporary` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`key` varchar(40) NOT NULL,
	`value` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_temporary_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_temporary_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_fc_tenant_id_tenants_id_fk` FOREIGN KEY (`fc_tenant_id`) REFERENCES `tenants`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_details` ADD CONSTRAINT `sales_details_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_details` ADD CONSTRAINT `sales_details_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_food_corner` ADD CONSTRAINT `sales_food_corner_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_temporary` ADD CONSTRAINT `sales_temporary_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;