import { Card } from "@/components/card";
import { Icons } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/db";
import { genre, otherName, series } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { getDramaInfo } from "@/lib/dramacool";
import {
  existingFromDatabase,
  getWatchLists,
  popFromWatchList,
  pushToWatchList,
} from "@/lib/helpers/server";
import { infoSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { z } from "zod";
import { SubmitButton } from "./client";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  let data = await getDramaInfo(params.slug);
  const parse = infoSchema.safeParse(data);
  if (!parse.success) throw new Error("failed to parse drama info");
  let parsed = parse.data;
  let {
    description,
    episodes,
    id,
    image,
    otherNames,
    releaseDate,
    title,
    genres,
  } = parse.data;
  return (
    <section className="mx-auto px-4 lg:container py-4 lg:py-10 space-y-6">
      <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        <div className="flex flex-col">
          <Suspense
            fallback={
              <Button variant={"secondary"} disabled>
                Loading ...
              </Button>
            }
          >
            <WatchListed dramaSeries={parsed} />
          </Suspense>
          <Suspense>
            <AdminAction slug={params.slug} />
          </Suspense>
        </div>
      </div>
      <Typography as={"h4"} variant={"h4"} className="text-muted-foreground">
        <strong className="text-foreground">Other Names:</strong>{" "}
        {otherNames?.join(", ")}
      </Typography>
      <p className="leading-7 [&:not(:first-child)]:mt-6 indent-10">
        {description}
      </p>
      <div className="flex flex-wrap gap-1">
        {genres?.map((genre, index) => (
          <Badge key={index}>{genre}</Badge>
        ))}
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {episodes?.length === 0 && (
              <div className="flex justify-center items-center gap-2 text-blue-500">
                <Icons.info /> No episodes for this drama yet.
              </div>
            )}
            {episodes?.map((ep, index) => (
              <Card
                key={index}
                data={{
                  title: ep.title,
                  image: image,
                  description: `${ep.subType} - ${
                    ep.releaseDate.includes("ago")
                      ? ep.releaseDate
                      : new Date(ep.releaseDate).toLocaleDateString()
                  }`,
                  link: `/watch/${ep.id}`,
                }}
                className="lg:w-[250px] w-28"
                aspectRatio="square"
                width={250}
                height={330}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}

async function WatchListed({
  dramaSeries,
}: {
  dramaSeries: z.infer<typeof infoSchema>;
}) {
  const watchLists = await getWatchLists();
  const slug = dramaSeries.id;
  const [_, existsInDb] = await existingFromDatabase(slug);
  if (!existsInDb)
    return (
      <p className="text-destructive lg:max-w-xs text-sm text-right">
        This drama can&apos;t be added to watchlist yet. Kindly contact the
        administrator.
      </p>
    );
  const found = watchLists.find((l) => l.dramaId === slug);
  let isWatchlisted = found?.dramaId === slug;
  const Icon = isWatchlisted ? Icons.minus : Icons.plus;
  return (
    <form
      action={async () => {
        "use server";
        if (isWatchlisted) {
          await popFromWatchList({ slug });
        } else {
          await pushToWatchList({ slug });
        }
        revalidatePath(`/drama/${slug}`);
      }}
    >
      <SubmitButton className="w-full">
        <Icon className="w-4 h-4" />
        {isWatchlisted ? "Remove from " : "Add to "}watchlist
      </SubmitButton>
    </form>
  );
}

async function AdminAction(props: { slug: string }) {
  let slug = `drama-detail/${props.slug}`;
  let sess = await auth();
  let [results, existsInDb] = await existingFromDatabase(slug);
  if (sess?.user.email !== "noelrohi59@gmail.com") return null;
  let seriesStatus: "not_upserted" | "upserted" | "not_exists" =
    existsInDb && !results?.description
      ? "not_upserted"
      : !!results?.description
      ? "upserted"
      : "not_exists";
  return (
    <form
      className="inline-flex justify-end mt-4"
      action={async (_: FormData) => {
        "use server";
        try {
          const res = await getDramaInfo(props.slug);
          const parse = infoSchema.safeParse(res);
          if (!parse.success)
            throw new Error("Schema doesn't match drama info.");
          const { data } = parse;
          const values: typeof series.$inferInsert = {
            coverImage: data.image,
            slug,
            title: data.title,
            description: data.description,
            releaseDate: String(data.releaseDate),
          };
          const genres: (typeof genre.$inferInsert)[] =
            data.genres?.map((genre) => ({ name: genre, dramaId: slug })) ?? [];
          const otherNames: (typeof otherName.$inferInsert)[] =
            data.otherNames?.map((genre) => ({ name: genre, dramaId: slug })) ??
            [];

          await db.transaction(async (tx) => {
            const { description, releaseDate } = values;
            await tx.insert(series).values(values).onDuplicateKeyUpdate({
              set: {
                description,
                releaseDate,
              },
            });
            if (genres.length > 0) {
              await tx.insert(genre).values(genres);
            }
            if (otherNames.length > 0) {
              await tx.insert(otherName).values(otherNames);
            }
          });
          revalidatePath(`/drama/${props.slug}`);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <SubmitButton disabled={seriesStatus === "upserted"}>
        {seriesStatus === "not_upserted" ? (
          "Upsert"
        ) : seriesStatus === "upserted" ? (
          "Upserted"
        ) : (
          <>
            <Icons.plus className="w-4 h-4" /> Add to db
          </>
        )}
      </SubmitButton>
    </form>
  );
}
