"use server";

import { db } from "@/db";
import {
  backUpLocalStorage,
  episode as episodeDb,
  watchList,
} from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProgress({
  episode,
  slug,
}: {
  episode: number;
  slug: string;
}): Promise<{ message: string; error: boolean }> {
  try {
    const session = await auth();
    if (!session) return { message: "Unauthorized.", error: true };
    const found = await db.query.watchList.findFirst({
      where: and(
        eq(watchList.userId, session.user.id),
        eq(watchList.dramaId, slug),
      ),
    });
    let status: "watching" | "finished" = "watching";
    if (!found) {
      await db.insert(watchList).values({
        dramaId: slug,
        status,
        userId: session.user.id,
        episode,
      });
    } else {
      const queryEpisode = await db.query.episode.findFirst({
        where: and(eq(episodeDb.dramaId, slug), eq(episodeDb.number, episode)),
        columns: {
          isLast: true,
        },
      });
      status = queryEpisode?.isLast ? "finished" : "watching";
      await db
        .update(watchList)
        .set({ episode, status })
        .where(
          and(
            eq(watchList.dramaId, slug),
            eq(watchList.userId, session.user.id),
          ),
        );
    }
    revalidatePath(`/drama/${slug.replace("drama-detail/", "")}`);
    return {
      message: `Your progress is updated. Status: ${status}, Episode: ${episode}`,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong.", error: true };
  }
}

const arraySchema = z.array(
  z.object({
    key: z.string(),
    value: z.object({
      playedSeconds: z.number(),
      played: z.number(),
      loadedSeconds: z.number(),
      loaded: z.number(),
    }),
  }),
);

export async function syncProgressToDB(
  progressList: Array<{ key: string; value: string }>,
) {
  try {
    const parse = arraySchema.safeParse(progressList);
    if (!parse.success) throw new Error("Invalid value.");
    const session = await auth();
    if (!session) throw new Error("Unauthorized.");

    const toInsert: (typeof backUpLocalStorage.$inferInsert)[] = parse.data.map(
      (d) => ({
        ...d,
        userId: session.user.id,
      }),
    );
    await db
      .delete(backUpLocalStorage)
      .where(eq(backUpLocalStorage.userId, session.user.id));
    await db.insert(backUpLocalStorage).values(toInsert);
    return {
      error: false,
      message: "Successfully backed up!",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    return { error: true, message: "Something went wrong." };
  }
}

export async function getProgressList() {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized.");
    const userId = session.user.id;
    return await db.query.backUpLocalStorage.findMany({
      where: (table, { eq }) => eq(table.userId, userId),
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
