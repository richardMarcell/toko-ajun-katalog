CREATE TABLE `promos` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`percentage` float NOT NULL DEFAULT 0,
	`amount` decimal(24,8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promos_id` PRIMARY KEY(`id`),
	CONSTRAINT `promos_code_unique` UNIQUE(`code`)
);
