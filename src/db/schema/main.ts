import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  float,
  index,
  int,
  json,
  longtext,
  mysqlEnum,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { idCreator, mySqlTable } from "./_table";
import { users } from "./auth";

export const watchList = mySqlTable(
  "watchList",
  {
    id: idCreator,
    userId: varchar("userId", { length: 255 }).notNull(),
    dramaId: varchar("dramaId", { length: 255 }).notNull(),
    status: mysqlEnum("status", [
      "watching",
      "on_hold",
      "dropped",
      "plan_to_watch",
      "finished",
    ]).notNull(),
    episode: float("episode").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      userIdx: index("user_idx").on(table.userId),
      dramaIdx: index("drama_idx").on(table.dramaId),
      statusIdx: index("status_idx").on(table.status),
    };
  },
);

export const watchListRelations = relations(watchList, ({ one }) => ({
  series: one(series, {
    fields: [watchList.dramaId],
    references: [series.slug],
  }),
  user: one(users, {
    fields: [watchList.userId],
    references: [users.id],
  }),
}));

export const series = mySqlTable(
  "series",
  {
    id: idCreator,
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    coverImage: varchar("coverImage", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["ongoing", "upcoming", "completed"]).default(
      "upcoming",
    ),
    genres: json("genres").$type<string[]>(),
    otherNames: json("other_names").$type<string[]>(),
    description: longtext("descripton"),
    releaseDate: varchar("releaseDate", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      slugIdx: index("slug_idx").on(table.slug),
      status: index("status_idx").on(table.status),
    };
  },
);

export const seriesRelations = relations(series, ({ many }) => ({
  episodes: many(episode),
}));

export const episode = mySqlTable(
  "episode",
  {
    id: idCreator,
    episodeSlug: varchar("episodeSlug", { length: 255 }).notNull(),
    dramaId: varchar("dramaId", { length: 255 }).notNull(),
    number: float("number").notNull(),
    subType: mysqlEnum("subType", ["SUB", "DUB", "RAW"]),
    isLast: boolean("isLast").default(false),
    title: varchar("title", { length: 255 }).notNull(),
    releaseDate: date("releaseDate"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
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

export const episodeRelations = relations(episode, ({ one }) => ({
  series: one(series, {
    fields: [episode.dramaId],
    references: [series.slug],
  }),
}));

type Value = {
  playedSeconds: number;
  played: number;
  loadedSeconds: number;
  loaded: number;
};

export const backUpLocalStorage = mySqlTable(
  "backup_local_storage",
  {
    id: idCreator,
    userId: varchar("user_id", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    value: json("value").$type<Value>().notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    keyIdx: index("key_idx").on(table.key),
    uniqueKeyPerUser: index("unique_key_per_user").on(table.userId, table.key),
  }),
);
