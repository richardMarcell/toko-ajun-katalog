RENAME TABLE `sales_detail_swimsuit_rent` TO `swimsuit_rent_wallet`;--> statement-breakpoint
ALTER TABLE `swimsuit_rent_wallet` DROP FOREIGN KEY `sales_detail_swimsuit_rent_sales_detail_id_sales_details_id_fk`;
--> statement-breakpoint
ALTER TABLE `swimsuit_rent_wallet` DROP FOREIGN KEY `sales_detail_swimsuit_rent_wallet_id_wallets_id_fk`;
--> statement-breakpoint
-- ALTER TABLE `swimsuit_rent_wallet` DROP PRIMARY KEY;--> statement-breakpoint
-- ALTER TABLE `swimsuit_rent_wallet` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `swimsuit_rent_wallet` ADD CONSTRAINT `swimsuit_rent_wallet_sales_detail_id_sales_details_id_fk` FOREIGN KEY (`sales_detail_id`) REFERENCES `sales_details`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `swimsuit_rent_wallet` ADD CONSTRAINT `swimsuit_rent_wallet_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;