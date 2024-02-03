CREATE TABLE `kd_backup_local_storage` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` json NOT NULL,
	CONSTRAINT `kd_backup_local_storage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `kd_backup_local_storage` (`user_id`);--> statement-breakpoint
CREATE INDEX `key_idx` ON `kd_backup_local_storage` (`key`);--> statement-breakpoint
CREATE INDEX `unique_key_per_user` ON `kd_backup_local_storage` (`user_id`,`key`);