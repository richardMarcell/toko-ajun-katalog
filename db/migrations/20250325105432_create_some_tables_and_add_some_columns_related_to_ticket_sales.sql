CREATE TABLE `customer_origins` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customer_origins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_ticket` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`customer_phone_number` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_ticket_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sales_details` ADD `is_journal_transaction` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `sales_ticket` ADD CONSTRAINT `sales_ticket_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;