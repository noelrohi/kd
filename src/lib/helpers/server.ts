import { db } from "@/db";
import { watchList as watchListSchema } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

async function authOrCookie() {
  const session = await auth();
  const cookieStore = cookies();
  return [session, cookieStore] as const;
}

const watchListZodSchema = z.array(
  z.object({
    dramaId: z.string(),
  })
);

export async function getWatchLists(): Promise<{ dramaId: string }[]> {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    const lists = await db.query.watchList.findMany({
      where: eq(watchListSchema.userId, session.user.id),
      columns: {
        dramaId: true,
      },
    });
    return lists;
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      return parse.data;
    }
  }
  return [];
}

export async function pushToWatchList({ slug }: { slug: string }) {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    await db.insert(watchListSchema).values({
      dramaId: slug,
      status: "plan_to_watch",
      userId: session.user.id,
    });
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      let lists = parse.data;
      lists.push({ dramaId: slug });
      cookieStore.set("watchlist", JSON.stringify(lists));
    }
  } else {
    cookieStore.set("watchlist", JSON.stringify([{ dramaId: slug }]));
  }
}

export async function popFromWatchList({ slug }: { slug: string }) {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    await db
      .delete(watchListSchema)
      .where(
        and(
          eq(watchListSchema.dramaId, slug),
          eq(watchListSchema.userId, session.user.id)
        )
      );
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      let lists = parse.data;
      let indexToRemove = lists.findIndex((obj) => obj.dramaId === slug);
      if (indexToRemove !== -1) {
        lists.splice(indexToRemove, 1);
      }
      cookieStore.set("watchlist", JSON.stringify(lists));
    }
  }
}
