CREATE TABLE `gazebo_wallet` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`wallet_id` bigint unsigned NOT NULL,
	`gazebo_id` bigint unsigned,
	`type` varchar(225) NOT NULL,
	`status` varchar(225) DEFAULT 'OPEN',
	`payment_status` varchar(225) DEFAULT 'UNPAID',
	`created_by` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gazebo_wallet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gazebos` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`status` varchar(225) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gazebos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD CONSTRAINT `gazebo_wallet_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD CONSTRAINT `gazebo_wallet_gazebo_id_gazebos_id_fk` FOREIGN KEY (`gazebo_id`) REFERENCES `gazebos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gazebo_wallet` ADD CONSTRAINT `gazebo_wallet_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;