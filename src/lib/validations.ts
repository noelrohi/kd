import { z } from "zod";

export const episodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  episode: z.number(),
  subType: z.enum(["SUB", "DUB", "RAW"]),
  releaseDate: z.string(),
  url: z.string().url(),
});

export const infoSchema = z.object({
  id: z.string(),
  title: z.string(),
  otherNames: z.array(z.string()).optional(),
  image: z.string().url(),
  description: z.string(),
  _status: z.enum(["completed", "upcoming", "ongoing"]).optional(),
  genres: z.array(z.string()).optional(),
  releaseDate: z.coerce.number(),
  episodes: z.array(episodeSchema).optional(),
});

const sourceSchema = z.object({
  url: z.string().url(),
  isM3U8: z.boolean(),
});

const subtitleSchema = z.object({
  url: z.string().url(),
  lang: z.string(),
});

export const episodeSourceSchema = z.object({
  sources: z.array(sourceSchema),
  subtitles: z.array(subtitleSchema).optional(),
});
