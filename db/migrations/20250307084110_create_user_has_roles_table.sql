CREATE TABLE `user_has_roles` (
	`role_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user_has_roles` ADD CONSTRAINT `user_has_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_has_roles` ADD CONSTRAINT `user_has_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;