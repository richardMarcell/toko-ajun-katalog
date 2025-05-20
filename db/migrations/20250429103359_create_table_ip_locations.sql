CREATE TABLE `ip_locations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`ip_address` varchar(255) NOT NULL,
	`location_desc` varchar(225) NOT NULL,
	`current_logged_in_user` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ip_locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `ip_locations_ip_address_unique` UNIQUE(`ip_address`)
);
--> statement-breakpoint
ALTER TABLE `ip_locations` ADD CONSTRAINT `ip_locations_current_logged_in_user_users_id_fk` FOREIGN KEY (`current_logged_in_user`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;