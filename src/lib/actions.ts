"use server";

import { db } from "@/db";
import { watchList } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

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
    if (!found) {
      await db.insert(watchList).values({
        dramaId: slug,
        status: "watching",
        userId: session.user.id,
        episode,
      });
    } else {
      await db
        .update(watchList)
        .set({ episode })
        .where(eq(watchList.dramaId, slug));
    }
    return { message: "Ok", error: false };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong.", error: true };
  }
}
