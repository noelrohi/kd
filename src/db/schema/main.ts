import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  json,
  pgEnum,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { idCreator, pgTable } from "./_table";

const watchlistStatus = pgEnum("watchlist_status", [
  "watching",
  "on_hold",
  "dropped",
  "plan_to_watch",
  "finished",
]);
const seriesStatusEnum = pgEnum("series_status", [
  "ongoing",
  "upcoming",
  "completed",
]);

export const watchList = pgTable(
  "watchList",
  {
    id: idCreator,
    userId: varchar("userId", { length: 255 }).notNull(),
    dramaId: varchar("dramaId", { length: 255 }).notNull(),
    status: watchlistStatus("status").notNull(),
    episode: integer("episode").default(0),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    dramaIdx: index("drama_idx").on(table.dramaId),
    statusIdx: index("status_idx").on(table.status),
    unique: unique("unique_watchList").on(table.userId, table.dramaId),
  }),
);

export const series = pgTable(
  "series",
  {
    id: idCreator,
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    coverImage: varchar("coverImage", { length: 255 }).notNull(),
    status: seriesStatusEnum("status").default("upcoming"),
    genres: json("genres").$type<string[]>(),
    otherNames: json("other_names").$type<string[]>(),
    description: text("descripton"),
    releaseDate: varchar("releaseDate", { length: 255 }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      status: index("status_idx").on(table.status),
    };
  },
);

const subTypeEnum = pgEnum("sub_type", ["SUB", "DUB", "RAW"]);

export const episode = pgTable(
  "episode",
  {
    id: idCreator,
    episodeSlug: varchar("episodeSlug", { length: 255 }).notNull(),
    dramaId: varchar("dramaId", { length: 255 }).notNull(),
    number: integer("number").notNull(),
    subType: subTypeEnum("subType"),
    isLast: boolean("isLast").default(false),
    title: varchar("title", { length: 255 }).notNull(),
    releaseDate: date("releaseDate"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      dramaIdx: index("drama_idx").on(table.dramaId),
      titleIdx: index("title_idx").on(table.title),
      episodeSlugIdx: index("episode_slug_idx").on(table.episodeSlug),
      numberIdx: index("number_idx").on(table.number),
    };
  },
);

export const progress = pgTable(
  "progress",
  {
    id: idCreator,
    userId: varchar("user_id", { length: 255 }).notNull(),
    episodeSlug: varchar("episode_slug", { length: 255 }).notNull(),
    seconds: integer("seconds").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      episodeSlugIdx: index("episode_slug_idx").on(table.episodeSlug),
      unique: unique("unique_progress").on(table.userId, table.episodeSlug),
    };
  },
);
