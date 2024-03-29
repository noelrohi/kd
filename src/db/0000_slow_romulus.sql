DO $$ BEGIN
 CREATE TYPE "series_status" AS ENUM('ongoing', 'upcoming', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "sub_type" AS ENUM('SUB', 'DUB', 'RAW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "watchlist_status" AS ENUM('watching', 'on_hold', 'dropped', 'plan_to_watch', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "kd_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "kd_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_episode" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"episodeSlug" varchar(255) NOT NULL,
	"dramaId" varchar(255) NOT NULL,
	"number" integer NOT NULL,
	"subType_enum" "sub_type",
	"isLast" boolean DEFAULT false,
	"title" varchar(255) NOT NULL,
	"releaseDate" date,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_progress" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"episode_slug" varchar(255) NOT NULL,
	"seconds" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "unique_progress" UNIQUE("user_id","episode_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_series" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"coverImage" varchar(255) NOT NULL,
	"status" "series_status" DEFAULT 'upcoming',
	"genres" json,
	"other_names" json,
	"descripton" text,
	"releaseDate" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "kd_series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kd_watchList" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"dramaId" varchar(255) NOT NULL,
	"status" "watchlist_status" NOT NULL,
	"episode" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "unique_watchList" UNIQUE("userId","dramaId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "drama_idx" ON "kd_episode" ("dramaId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "kd_episode" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "episode_slug_idx" ON "kd_episode" ("episodeSlug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "number_idx" ON "kd_episode" ("number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "kd_series" ("status");