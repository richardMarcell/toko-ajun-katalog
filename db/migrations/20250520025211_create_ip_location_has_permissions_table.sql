CREATE TABLE `ip_location_has_permissions` (
	`permission_id` bigint unsigned NOT NULL,
	`ip_location_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
ALTER TABLE `ip_location_has_permissions` ADD CONSTRAINT `ip_location_has_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ip_location_has_permissions` ADD CONSTRAINT `ip_location_has_permissions_ip_location_id_ip_locations_id_fk` FOREIGN KEY (`ip_location_id`) REFERENCES `ip_locations`(`id`) ON DELETE restrict ON UPDATE no action;