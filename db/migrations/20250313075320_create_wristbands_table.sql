CREATE TABLE `wristbands` (
	`code` varchar(255) NOT NULL,
	`status` varchar(225) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wristbands_code` PRIMARY KEY(`code`)
);
