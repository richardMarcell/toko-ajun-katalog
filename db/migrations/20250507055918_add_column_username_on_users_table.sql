ALTER TABLE `users` ADD `username` varchar(255) NOT NULL AFTER `name`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);