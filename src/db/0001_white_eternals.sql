CREATE TABLE `kd_genre` (
	`id` varchar(128) NOT NULL,
	`dramaId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_genre_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `drama_idx` ON `kd_genre` (`dramaId`);--> statement-breakpoint
CREATE INDEX `drama_idx` ON `kd_other_name` (`dramaId`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `kd_series` (`slug`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `kd_watchList` (`userId`);--> statement-breakpoint
CREATE INDEX `drama_idx` ON `kd_watchList` (`dramaId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `kd_watchList` (`status`);