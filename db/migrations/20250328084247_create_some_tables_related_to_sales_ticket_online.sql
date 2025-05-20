CREATE TABLE `payments` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`payment_method` varchar(255) NOT NULL,
	`total_payment` decimal(24,8) NOT NULL,
	`change_amount` decimal(24,8) NOT NULL,
	`ota_redeem_code` varchar(255),
	`vendor_type_code` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_payment_method_unique` UNIQUE(`payment_method`),
	CONSTRAINT `payments_ota_redeem_code_unique` UNIQUE(`ota_redeem_code`)
);
--> statement-breakpoint
CREATE TABLE `vendor_types` (
	`code` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_types_code` PRIMARY KEY(`code`),
	CONSTRAINT `vendor_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_vendor_type_code_vendor_types_code_fk` FOREIGN KEY (`vendor_type_code`) REFERENCES `vendor_types`(`code`) ON DELETE restrict ON UPDATE no action;