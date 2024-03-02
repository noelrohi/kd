CREATE TABLE `kd_progress` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`episode_slug` varchar(255) NOT NULL,
	`seconds` float NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_progress` UNIQUE(`user_id`,`episode_slug`)
);
--> statement-breakpoint
ALTER TABLE `kd_episode` MODIFY COLUMN `created_at` timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `kd_series` MODIFY COLUMN `created_at` timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `kd_watchList` MODIFY COLUMN `created_at` timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `user_idx` ON `kd_progress` (`user_id`);--> statement-breakpoint
CREATE INDEX `episode_slug_idx` ON `kd_progress` (`episode_slug`);