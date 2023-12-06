import {
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { idCreator } from "./_table";
import { relations } from "drizzle-orm";
import { users } from "./auth";

export const watchList = mysqlTable("watchList", {
  id: idCreator,
  userId: varchar("userId", { length: 255 }),
  dramaId: varchar("dramaId", { length: 255 }),
  status: mysqlEnum("status", [
    "watching",
    "on_hold",
    "dropped",
    "plan_to_watch",
    "finished",
  ]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  watchlists: many(watchList),
}));
