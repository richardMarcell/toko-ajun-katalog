CREATE TABLE `booklet_promo` (
	`booklet_id` bigint unsigned NOT NULL,
	`promo_id` bigint unsigned NOT NULL,
	`qty` int unsigned NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `booklet_used_promos` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`booklet_id` bigint unsigned NOT NULL,
	`booklet_code` varchar(255) NOT NULL,
	`promo_id` bigint unsigned NOT NULL,
	`sales_id` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booklet_used_promos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booklets` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code_start` varchar(255) NOT NULL,
	`code_end` varchar(255) NOT NULL,
	`is_active` boolean DEFAULT false,
	`periode_start` date NOT NULL,
	`periode_end` date NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booklets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD `created_by` bigint unsigned AFTER `returned_at`;--> statement-breakpoint
ALTER TABLE `promos` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `promos` ADD `short_description` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `promos` ADD `is_required_booklet` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `booklet_promo` ADD CONSTRAINT `booklet_promo_booklet_id_booklets_id_fk` FOREIGN KEY (`booklet_id`) REFERENCES `booklets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booklet_promo` ADD CONSTRAINT `booklet_promo_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booklet_used_promos` ADD CONSTRAINT `booklet_used_promos_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booklet_used_promos` ADD CONSTRAINT `booklet_used_promos_booklet_id_booklets_id_fk` FOREIGN KEY (`booklet_id`) REFERENCES `booklets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booklet_used_promos` ADD CONSTRAINT `booklet_used_promos_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booklet_used_promos` ADD CONSTRAINT `booklet_used_promos_sales_id_sales_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `sales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `locker_wallet` ADD CONSTRAINT `locker_wallet_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;