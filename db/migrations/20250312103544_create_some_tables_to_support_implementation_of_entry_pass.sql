CREATE TABLE `entry_pass_customer_histories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned,
	`ep_customer_id` bigint unsigned NOT NULL COMMENT 'Relasi dengan table entry_pass_customers',
	`product_id` bigint unsigned NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`registered_at` date NOT NULL,
	`valid_until` date NOT NULL,
	`valid_for` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entry_pass_customer_histories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entry_pass_customers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`national_id_number` varchar(20),
	`phone_number` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entry_pass_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `entry_pass_customers_national_id_number_unique` UNIQUE(`national_id_number`),
	CONSTRAINT `entry_pass_customers_phone_number_unique` UNIQUE(`phone_number`)
);
--> statement-breakpoint
CREATE TABLE `sales_entry_pass` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`ep_customer_id` bigint unsigned NOT NULL COMMENT 'Relasi dengan table entry_pass_customers',
	`created_by` bigint unsigned NOT NULL,
	`valid_for` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_entry_pass_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `entry_pass_customer_histories` ADD CONSTRAINT `fk_ep_customer_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entry_pass_customer_histories` ADD CONSTRAINT `fk_ep_customer_customer` FOREIGN KEY (`ep_customer_id`) REFERENCES `entry_pass_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entry_pass_customer_histories` ADD CONSTRAINT `fk_ep_customer_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entry_pass_customer_histories` ADD CONSTRAINT `fk_ep_customer_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_entry_pass` ADD CONSTRAINT `fk_salentry_pass_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_entry_pass` ADD CONSTRAINT `fk_salentry_pass_customer` FOREIGN KEY (`ep_customer_id`) REFERENCES `entry_pass_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_entry_pass` ADD CONSTRAINT `fk_salentry_pass_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;