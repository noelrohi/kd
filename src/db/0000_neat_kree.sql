CREATE TABLE `kd_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `kd_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `kd_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `kd_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `kd_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	CONSTRAINT `kd_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kd_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `kd_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `kd_other_name` (
	`id` varchar(128) NOT NULL,
	`dramaId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_other_name_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kd_series` (
	`id` varchar(128) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`coverImage` varchar(255) NOT NULL,
	`descripton` varchar(255),
	`releaseDate` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_series_id` PRIMARY KEY(`id`),
	CONSTRAINT `kd_series_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `kd_watchList` (
	`id` varchar(128) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`dramaId` varchar(255) NOT NULL,
	`status` enum('watching','on_hold','dropped','plan_to_watch','finished') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kd_watchList_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `kd_account` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `kd_session` (`userId`);