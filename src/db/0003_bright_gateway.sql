CREATE TABLE `kd_episode` (
	`id` varchar(128) NOT NULL,
	`episodeSlug` varchar(255) NOT NULL,
	`dramaId` varchar(255) NOT NULL,
	`number` float NOT NULL,
	`subType` enum('SUB','DUB','RAW'),
	`isLast` boolean DEFAULT false,
	`title` varchar(255) NOT NULL,
	`releaseDate` date,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_episode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `kd_genre` MODIFY COLUMN `dramaId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `kd_series` ADD `status` enum('ongoing','upcoming','completed') DEFAULT 'upcoming';--> statement-breakpoint
ALTER TABLE `kd_watchList` ADD `episode` float DEFAULT 0;--> statement-breakpoint
CREATE INDEX `drama_idx` ON `kd_episode` (`dramaId`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `kd_episode` (`title`);--> statement-breakpoint
CREATE INDEX `episode_slug_idx` ON `kd_episode` (`episodeSlug`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `kd_series` (`status`);