CREATE TABLE `kd_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` longtext,
	`access_token` longtext,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(255),
	`session_state` varchar(255),
	CONSTRAINT `kd_account_providerAccountId_provider_pk` PRIMARY KEY(`providerAccountId`,`provider`)
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
	`name` varchar(255) NOT NULL,
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
CREATE TABLE `watchList` (
	`id` varchar(128),
	`userId` varchar(255),
	`dramaId` varchar(255),
	`status` enum('watching','on_hold','dropped','plan_to_watch','finished'),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `kd_account` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `kd_session` (`userId`);