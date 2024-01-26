import { db } from "@/db";
import { series, watchList as watchListSchema } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
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
  }),
);

export async function getWatchLists(): Promise<
  {
    dramaId: string;
    status:
      | "watching"
      | "on_hold"
      | "dropped"
      | "plan_to_watch"
      | "finished"
      | null;
    series: {
      id: string;
      description: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      slug: string;
      title: string;
      coverImage: string;
      releaseDate: string | null;
    } | null;
  }[]
> {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    const lists = await db.query.watchList.findMany({
      where: eq(watchListSchema.userId, session.user.id),
      orderBy: (watchList, { desc }) => [
        desc(watchList.updatedAt),
        desc(watchList.createdAt),
      ],
      columns: {
        dramaId: true,
        status: true,
      },
      with: {
        series: true,
      },
    });
    return lists;
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      const array = parse.data.map((d) => d.dramaId);
      if (array.length !== 0) {
        const lists = await db.query.series.findMany({
          where: inArray(series.slug, array),
        });
        return lists.map((l) => ({
          dramaId: l.slug,
          status: null,
          series: l,
        }));
      }
    }
  }
  return [];
}

type WatchlistProps = {
  slug: string;
};

export async function pushToWatchList({ slug }: WatchlistProps) {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    // console.log("reading db planetscale ...");
    await db.insert(watchListSchema).values({
      dramaId: slug,
      status: "plan_to_watch",
      userId: session.user.id,
    });
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    // console.log("reading cookie store...");
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      const lists = parse.data;
      lists.push({ dramaId: slug });
      cookieStore.set("watchlist", JSON.stringify(lists));
    }
  } else {
    cookieStore.set("watchlist", JSON.stringify([{ dramaId: slug }]));
  }
}

export async function popFromWatchList({ slug }: WatchlistProps) {
  const [session, cookieStore] = await authOrCookie();
  if (session) {
    await db
      .delete(watchListSchema)
      .where(
        and(
          eq(watchListSchema.dramaId, slug),
          eq(watchListSchema.userId, session.user.id),
        ),
      );
  }
  const watchlistLocal = cookieStore.get("watchlist")?.value;
  if (watchlistLocal) {
    const parse = watchListZodSchema.safeParse(JSON.parse(watchlistLocal));
    if (parse.success) {
      const lists = parse.data;
      const indexToRemove = lists.findIndex((obj) => obj.dramaId === slug);
      if (indexToRemove !== -1) {
        lists.splice(indexToRemove, 1);
      }
      cookieStore.set("watchlist", JSON.stringify(lists));
    }
  }
}

export async function existingFromDatabase(slug: string) {
  const res = await db.query.series.findFirst({ where: eq(series.slug, slug) });
  return [res, typeof res !== "undefined"] as const;
}
