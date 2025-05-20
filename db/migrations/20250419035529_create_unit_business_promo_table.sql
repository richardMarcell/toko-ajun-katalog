CREATE TABLE `unit_business_has_promo` (
	`nama` varchar(255) NOT NULL,
	`promo_id` bigint unsigned NOT NULL,
	CONSTRAINT `ux_unit_business_promo` UNIQUE(`nama`,`promo_id`)
);
--> statement-breakpoint
ALTER TABLE `unit_business_has_promo` ADD CONSTRAINT `unit_business_has_promo_promo_id_promos_id_fk` FOREIGN KEY (`promo_id`) REFERENCES `promos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_food_corner` DROP COLUMN `customer_name`;