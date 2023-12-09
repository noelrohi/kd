DROP TABLE `kd_genre`;--> statement-breakpoint
DROP TABLE `kd_other_name`;--> statement-breakpoint
ALTER TABLE `kd_series` ADD `genres` json;--> statement-breakpoint
ALTER TABLE `kd_series` ADD `other_names` json;