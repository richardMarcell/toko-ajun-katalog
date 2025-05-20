CREATE TABLE `rooms` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `captain_orders` DROP FOREIGN KEY `captain_orders_promo_id_promos_id_fk`;
--> statement-breakpoint
ALTER TABLE `captain_orders` MODIFY COLUMN `table_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD `room_id` bigint unsigned AFTER `table_id`;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD `order_number` varchar(255) NOT NULL AFTER `code`;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD `bill_print_count` int unsigned DEFAULT 0 NOT NULL AFTER `is_closed`;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD `table_check_print_count` int unsigned DEFAULT 0 NOT NULL AFTER `bill_print_count`;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD `kitchen_print_count` int unsigned DEFAULT 0 NOT NULL AFTER `table_check_print_count`;--> statement-breakpoint
ALTER TABLE `captain_orders` ADD CONSTRAINT `captain_orders_code_unique` UNIQUE(`code`);--> statement-breakpoint
ALTER TABLE `captain_orders` ADD CONSTRAINT `captain_orders_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `captain_orders` DROP COLUMN `promo_id`;--> statement-breakpoint
ALTER TABLE `tables` DROP COLUMN `status`;