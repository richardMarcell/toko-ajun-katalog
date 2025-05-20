ALTER TABLE `swimming_class_customer_histories` ADD `sales_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` ADD `valid_until` date NOT NULL;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` ADD CONSTRAINT `fk_sch_sales` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;