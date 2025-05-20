ALTER TABLE `products` MODIFY COLUMN `swimming_class_valid_for` int unsigned;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `ep_valid_term` int unsigned;--> statement-breakpoint
ALTER TABLE `sales_details` MODIFY COLUMN `qty` int unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `sales_swimming_class` MODIFY COLUMN `valid_for` int unsigned;--> statement-breakpoint
ALTER TABLE `stocks` MODIFY COLUMN `qty` int unsigned;--> statement-breakpoint
ALTER TABLE `swimming_class_customer_histories` MODIFY COLUMN `valid_for` int unsigned;