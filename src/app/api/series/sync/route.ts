import { db } from "@/db";
import { series } from "@/db/schema/main";
import { getRecent, getTrending } from "@/lib/dramacool";
import { withUnkey } from "@unkey/nextjs";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = withUnkey(async (req) => {
  if (!req.unkey.valid || req.unkey.ownerId !== "Rohi") {
    return new NextResponse("unauthorized", { status: 403 });
  }
  try {
    let valuesToInsert: (typeof series.$inferInsert)[] = [];
    const searchparams = req.nextUrl.searchParams;
    const type = searchparams.get("type") ?? "trending";

    if (type === "trending") {
      const trends = await getTrending();
      if (!trends) throw new Error("Trending failed to fetch.");
      const data = trends.results;
      data.forEach((d) => {
        valuesToInsert.push({
          coverImage: d.image,
          slug: d.id,
          title: d.title,
        });
      });
    } else if (type === "recent") {
      const recents = await getRecent();
      if (!recents) throw new Error("Recents failed to fetch");
      const data = recents.results;
      data.forEach((d) => {
        valuesToInsert.push({
          coverImage: d.image,
          slug: d.id,
          title: d.title,
        });
      });
    }
    await db
      .insert(series)
      .values(valuesToInsert)
      .onDuplicateKeyUpdate({ set: { id: sql`id` } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
});
