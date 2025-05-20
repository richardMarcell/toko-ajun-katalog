CREATE TABLE `sales_dimsum` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`order_number` varchar(255) NOT NULL,
	`table_number` varchar(5),
	`customer_name` varchar(255),
	`order_type` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_dimsum_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sales_temporary` DROP INDEX `sales_temporary_key_unique`;--> statement-breakpoint
ALTER TABLE `sales_temporary` DROP INDEX `sales_temporary_unit_business_unique`;--> statement-breakpoint
ALTER TABLE `sales_temporary` ADD CONSTRAINT `unique_user_unit_business` UNIQUE(`user_id`,`unit_business`);--> statement-breakpoint
ALTER TABLE `sales_dimsum` ADD CONSTRAINT `sales_dimsum_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_temporary` DROP COLUMN `key`;