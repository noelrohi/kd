import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { verifyKey } from "@unkey/api";
import { z } from "zod";

const metaSchema = z.object({
  email_address: z.string().email(),
});

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
  if (!key) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { error, result } = await verifyKey(key);
  if (!result?.valid) {
    console.log({ error });
    return Response.json({ message: "Not valid api key" }, { status: 400 });
  }

  const parse = metaSchema.safeParse(result.meta);
  if (!parse.success)
    return Response.json(
      { message: "This key has no email address meta." },
      { status: 400 }
    );
  try {
    const watchlists = await db.query.users.findFirst({
      where: eq(users.email, parse.data.email_address),
      with: {
        watchlists: {
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
              },
            },
          },
        },
      },
    });
    return Response.json(
      watchlists?.watchlists.map((w) => ({
        title: w.series.title,
        date: w.updatedAt ? w.updatedAt : w.createdAt,
        episode: w.episode,
        status: w.status,
      }))
    );
  } catch (error) {
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}
