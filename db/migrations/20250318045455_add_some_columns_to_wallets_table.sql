ALTER TABLE `wallets` ADD `code` varchar(225) AFTER `id` ;--> statement-breakpoint
ALTER TABLE `wallets` ADD `deposit_payment_method` varchar(255) AFTER `customer_phone_number`;--> statement-breakpoint
ALTER TABLE `wallets` ADD `status` varchar(225) DEFAULT 'OPEN' NOT NULL AFTER `saldo`;