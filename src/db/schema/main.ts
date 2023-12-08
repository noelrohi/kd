import { relations } from "drizzle-orm";
import { index, mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      userIdx: index("user_idx").on(table.userId),
      dramaIdx: index("drama_idx").on(table.dramaId),
      statusIdx: index("status_idx").on(table.status),
    };
  }
);

export const watchListRelations = relations(watchList, ({ one }) => ({
  series: one(series),
}));

export const series = mySqlTable(
  "series",
  {
    id: idCreator,
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    coverImage: varchar("coverImage", { length: 255 }).notNull(),
    description: varchar("descripton", { length: 255 }),
    releaseDate: varchar("releaseDate", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      slugIdx: index("slug_idx").on(table.slug),
    };
  }
);

export const seriesRelations = relations(series, ({ many }) => ({
  otherNames: many(otherName),
}));

export const otherName = mySqlTable(
  "other_name",
  {
    id: idCreator,
    dramaId: varchar("dramaId", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      dramaIdx: index("drama_idx").on(table.dramaId),
    };
  }
);
