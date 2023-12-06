ALTER TABLE `kd_account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `kd_account` ADD PRIMARY KEY(`provider`,`providerAccountId`);