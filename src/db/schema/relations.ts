import { relations } from "drizzle-orm";
import { accounts, users } from "./auth";
import { progress, series, watchList, episode } from "./main";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  watchlists: many(watchList),
  progress: many(progress),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
}));
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
export const seriesRelations = relations(series, ({ many }) => ({
  episodes: many(episode),
}));

export const episodeRelations = relations(episode, ({ one }) => ({
  series: one(series, {
    fields: [episode.dramaId],
    references: [series.slug],
  }),
}));
