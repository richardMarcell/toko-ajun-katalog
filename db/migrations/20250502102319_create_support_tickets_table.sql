CREATE TABLE `support_tickets` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`ip_address` varchar(255) NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`mark_as_done_by` bigint unsigned,
	`is_done` boolean NOT NULL DEFAULT false,
	`mark_as_done_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_ip_address_ip_locations_ip_address_fk` FOREIGN KEY (`ip_address`) REFERENCES `ip_locations`(`ip_address`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_mark_as_done_by_users_id_fk` FOREIGN KEY (`mark_as_done_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;