CREATE TABLE `role_has_permissions` (
	`permission_id` bigint unsigned NOT NULL,
	`role_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;