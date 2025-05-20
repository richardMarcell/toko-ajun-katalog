CREATE TABLE `sales_swimming_class` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`sc_customer_id` bigint unsigned NOT NULL COMMENT 'Relasi dengan table swimming_class_customers',
	`created_by` bigint unsigned NOT NULL,
	`valid_for` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_swimming_class_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swimming_class_customer_histories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sc_customer_id` bigint unsigned NOT NULL COMMENT 'Relasi dengan table swimming_class_customers',
	`product_id` bigint unsigned NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`registered_at` date NOT NULL,
	`valid_for` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swimming_class_customer_histories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swimming_class_customers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`national_id_number` varchar(20),
	`phone_number` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swimming_class_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `swimming_class_customers_national_id_number_unique` UNIQUE(`national_id_number`),
	CONSTRAINT `swimming_class_customers_phone_number_unique` UNIQUE(`phone_number`)
);
--> statement-breakpoint
ALTER TABLE `sales_swimming_class` ADD CONSTRAINT `fk_sales_swimming_class_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_swimming_class` ADD CONSTRAINT `fk_sales_swimming_class_customer` FOREIGN KEY (`sc_customer_id`) REFERENCES `swimming_class_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_swimming_class` ADD CONSTRAINT `fk_sales_swimming_class_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` ADD CONSTRAINT `fk_sch_customer` FOREIGN KEY (`sc_customer_id`) REFERENCES `swimming_class_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` ADD CONSTRAINT `fk_sch_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` ADD CONSTRAINT `fk_sch_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;