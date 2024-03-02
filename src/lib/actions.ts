"use server";

import { db } from "@/db";
import { episode as episodeDb, progress, watchList } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function updateWatchlist(props: {
  episode: number;
  slug: string;
  watched: boolean;
}): Promise<{ message: string; error: boolean }> {
  const { watched, slug } = props;
  const episode = !watched
    ? props.episode > 0
      ? props.episode
      : 1
    : props.episode - 1;
  try {
    const session = await auth();
    if (!session) return { message: "Unauthorized.", error: true };
    const queryEpisode = await db.query.episode.findFirst({
      where: and(eq(episodeDb.dramaId, slug), eq(episodeDb.number, episode)),
      columns: {
        isLast: true,
      },
    });
    const status = queryEpisode?.isLast ? "finished" : "watching";
    const values: typeof watchList.$inferInsert = {
      dramaId: slug,
      status,
      userId: session.user.id,
      episode,
    };
    await db.insert(watchList).values(values).onDuplicateKeyUpdate({
      set: values,
    });
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

export const cacheProgressUpdate = cache(updateVideoProgress);

type ProgressUpdateProps = Omit<typeof progress.$inferInsert, "userId">;

async function updateVideoProgress(values: ProgressUpdateProps) {
  try {
    console.log("Updating video progress ...");
    const session = await auth();
    if (!session) throw new Error("Unauthorized");
    await db
      .insert(progress)
      .values({
        ...values,
        userId: session.user.id,
      })
      .onDuplicateKeyUpdate({
        set: {
          seconds: values.seconds,
        },
      });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error);
  }
}
