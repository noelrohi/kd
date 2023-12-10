"use server";

import { db } from "@/db";
import { episode as episodeDb, watchList } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
        eq(watchList.dramaId, slug)
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
            eq(watchList.userId, session.user.id)
          )
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
