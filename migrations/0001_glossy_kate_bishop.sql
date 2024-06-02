DROP INDEX IF EXISTS "drama_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "title_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "episode_slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "number_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "status_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "drama_idx" ON "kd_episode" USING btree (dramaId);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "kd_episode" USING btree (title);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "episode_slug_idx" ON "kd_episode" USING btree (episodeSlug);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "number_idx" ON "kd_episode" USING btree (number);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "kd_series" USING btree (status);