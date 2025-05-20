ALTER TABLE `payments` DROP INDEX `payments_payment_method_unique`;--> statement-breakpoint
ALTER TABLE `payments` ADD `wristband_code` varchar(255) AFTER `vendor_type_code`;--> statement-breakpoint
ALTER TABLE `payments` ADD `wallet_id` bigint unsigned AFTER `wristband_code`;--> statement-breakpoint
ALTER TABLE `payments` ADD `cardholder_name` varchar(255) AFTER `wallet_id`;--> statement-breakpoint
ALTER TABLE `payments` ADD `debit_card_number` varchar(255) AFTER `cardholder_name`;--> statement-breakpoint
ALTER TABLE `payments` ADD `referenced_id` varchar(255) AFTER `debit_card_number`;--> statement-breakpoint
ALTER TABLE `payments` ADD `debit_issuer_bank` varchar(255) AFTER `referenced_id`;--> statement-breakpoint
ALTER TABLE `payments` ADD `credit_card_number` varchar(255) AFTER `debit_issuer_bank`;--> statement-breakpoint
ALTER TABLE `payments` ADD `qris_issuer` varchar(255) AFTER `credit_card_number`;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;