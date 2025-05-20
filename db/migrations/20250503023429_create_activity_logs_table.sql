CREATE TABLE `activity_logs` (
	`ip_address` varchar(255) NOT NULL,
	`user_id` bigint unsigned,
	`endpoint` varchar(255) NOT NULL,
	`payloads` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;