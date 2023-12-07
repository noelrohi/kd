import { relations } from "drizzle-orm";
import { mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";
import { idCreator, mySqlTable } from "./_table";
import { users } from "./auth";

export const watchList = mySqlTable("watchList", {
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
});

export const usersRelations = relations(users, ({ many }) => ({
  watchlists: many(watchList),
}));
