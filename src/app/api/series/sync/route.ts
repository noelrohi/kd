import { db } from "@/db";
import { series } from "@/db/schema/main";
import { getTrending } from "@/lib/dramacool";
import { withUnkey } from "@unkey/nextjs";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = withUnkey(async (req) => {
  if (!req.unkey.valid || req.unkey.ownerId !== "Rohi") {
    return new NextResponse("unauthorized", { status: 403 });
  }
  try {
    const valuesToInsert: (typeof series.$inferInsert)[] = [];
    const trends = await getTrending();
    if (!trends) throw new Error("Trending failed to fetch.");
    const data = trends.results;

    for (const d of data) {
      valuesToInsert.push({
        coverImage: d.image,
        slug: d.id,
        title: d.title,
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
      { status: 500 },
    );
  }
});
