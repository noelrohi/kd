import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  json,
  text as longtext,
  pgEnum,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { idCreator, projectTable } from "./_table";

export const watchListStatusEnum = pgEnum("watchlist_status", [
  "watching",
  "on_hold",
  "dropped",
  "plan_to_watch",
  "finished",
]);

export const seriesStatusEnum = pgEnum("series_status", [
  "ongoing",
  "upcoming",
  "completed",
]);

export const subTypeEnum = pgEnum("sub_type", ["SUB", "DUB", "RAW"]);

export const watchList = projectTable(
  "watchList",
  {
    id: idCreator,
    userId: varchar("userId", { length: 255 }).notNull(),
    dramaId: varchar("dramaId", { length: 255 }).notNull(),
    status: watchListStatusEnum("status").notNull(),
    episode: integer("episode").default(0),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unique: unique("unique_watchList").on(table.userId, table.dramaId),
  }),
);

export const series = projectTable(
  "series",
  {
    id: idCreator,
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    coverImage: varchar("coverImage", { length: 255 }).notNull(),
    status: seriesStatusEnum("status").default("upcoming"),
    genres: json("genres").$type<string[]>(),
    otherNames: json("other_names").$type<string[]>(),
    description: longtext("descripton"),
    releaseDate: varchar("releaseDate", { length: 255 }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      status: index("status_idx").on(table.status),
    };
  },
);

export const episode = projectTable(
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
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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

export const progress = projectTable(
  "progress",
  {
    id: idCreator,
    userId: varchar("user_id", { length: 255 }).notNull(),
    episodeSlug: varchar("episode_slug", { length: 255 }).notNull(),
    seconds: decimal("seconds").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      unique: unique("unique_progress").on(table.userId, table.episodeSlug),
    };
  },
);
