CREATE TABLE `wallets` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`consumer_name` varchar(225) NOT NULL,
	`consumer_phone_number` varchar(225) NOT NULL,
	`deposit_amount` decimal(24,8) NOT NULL,
	`saldo` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
