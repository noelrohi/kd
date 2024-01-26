import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { watchList } from "@/db/schema/main";
import { absoluteUrl } from "@/lib/utils";
import { withUnkey } from "@unkey/nextjs";
import { desc, eq, notInArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const metaSchema = z.object({
  email_address: z.string().email(),
  for: z.string(),
});

export const dynamic = "force-dynamic";

export const GET = withUnkey(async (req) => {
  if (!req.unkey.valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const parse = metaSchema.safeParse(req.unkey.meta);
  if (!parse.success)
    return NextResponse.json(
      { message: "This key has no email address meta." },
      { status: 400 },
    );

  if (parse.data.for !== "K-NEXT")
    return NextResponse.json(
      { message: "Key does not belong to K-Next" },
      { status: 400 },
    );
  try {
    const watchlists = await db.query.users.findFirst({
      where: eq(users.email, parse.data.email_address),
      with: {
        watchlists: {
          orderBy: [desc(watchList.updatedAt), desc(watchList.createdAt)],
          where: notInArray(watchList.status, [
            "dropped",
            "on_hold",
            "plan_to_watch",
          ]),
          columns: {
            episode: true,
            status: true,
            updatedAt: true,
            createdAt: true,
          },
          with: {
            series: {
              columns: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(
      watchlists?.watchlists.map((w) => ({
        title: w.series.title,
        date: w.updatedAt ? w.updatedAt : w.createdAt,
        episode: w.episode,
        status: w.status,
        url: absoluteUrl(
          `/drama/${w.series.slug.replace("drama-detail/", "")}`,
        ),
      })),
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
});
