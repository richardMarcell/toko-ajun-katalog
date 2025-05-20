CREATE TABLE `locker_wallet` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`wallet_id` bigint unsigned NOT NULL,
	`locker_id` bigint unsigned,
	`type` varchar(225) NOT NULL,
	`status` varchar(225) DEFAULT 'OPEN',
	`payment_status` varchar(225) DEFAULT 'UNPAID',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locker_wallet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lockers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`status` varchar(225) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lockers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD CONSTRAINT `locker_wallet_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD CONSTRAINT `locker_wallet_locker_id_lockers_id_fk` FOREIGN KEY (`locker_id`) REFERENCES `lockers`(`id`) ON DELETE restrict ON UPDATE no action;