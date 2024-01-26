import { Card } from "@/components/card";
import { Loading } from "@/components/fallbacks/loading";
import { Icons } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/db";
import { episode, series, watchList } from "@/db/schema/main";
import { auth } from "@/lib/auth";
import { getDramaInfo } from "@/lib/dramacool";
import {
  existingFromDatabase,
  getWatchLists,
  popFromWatchList,
  pushToWatchList,
} from "@/lib/helpers/server";
import { cn } from "@/lib/utils";
import { infoSchema } from "@/lib/validations";
import { and, asc, eq } from "drizzle-orm";
import type { Metadata, ResolvingMetadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense, cache } from "react";
import { z } from "zod";
import { SubmitButton } from "./client";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const dramaInfo = await getDramaInfo(params.slug);
    if (!dramaInfo) throw new Error("Episode info not found!");
    const { description, title, image } = infoSchema.parse(dramaInfo);
    return {
      title,
      description,
      openGraph: {
        images: [image],
      },
    };
  } catch (error) {
    const { title, description } = await parent;
    return {
      title,
      description,
    };
  }
}

export default async function Page({ params }: PageProps) {
  const data = await getDramaInfo(params.slug);
  const parse = infoSchema.safeParse(data);
  if (!parse.success) throw new Error("failed to parse drama info");
  const parsed = parse.data;
  const {
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
    <section className="mx-auto w-screen space-y-6 px-4 py-4 lg:container lg:py-10">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:gap-0">
        <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
          {title}
        </h1>
        <div className="flex flex-col gap-2">
          {!!episodes && episodes.length > 0 && (
            <Suspense
              fallback={
                <Button disabled>
                  <Loading />
                </Button>
              }
            >
              <LastPlayedEpisode slug={params.slug} />
            </Suspense>
          )}
          <Suspense
            fallback={
              <Button variant={"secondary"} disabled>
                <Loading />
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
      <p className="indent-10 leading-7 [&:not(:first-child)]:mt-6">
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
              <div className="flex items-center justify-center gap-2 text-blue-500">
                <Icons.info /> No episodes for this drama yet.
              </div>
            )}
            {episodes?.map((ep, index) => (
              <Card
                key={index}
                prefetch={false}
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
                className="w-28 lg:w-[250px]"
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
      <p className="text-right text-destructive text-sm lg:max-w-xs">
        This drama can&apos;t be added to watchlist yet. Kindly contact the
        administrator.
      </p>
    );
  const found = watchLists.find((l) => l.dramaId === slug);
  const isWatchlisted = found?.dramaId === slug;
  const Icon = isWatchlisted ? Icons.minus : Icons.plus;
  const isCompleted = found?.status === "finished";
  if (isCompleted)
    return <Button disabled> You already finished this drama.</Button>;
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
      <SubmitButton className="w-full min-w-[200px]">
        <Icon className="size-4" />
        {isWatchlisted ? "Remove from " : "Add to "}watchlist
      </SubmitButton>
    </form>
  );
}

async function AdminAction(props: { slug: string }) {
  const slug = `drama-detail/${props.slug}`;
  const sess = await userSession();
  const [results, existsInDb] = await existingFromDatabase(slug);
  if (sess?.user.email !== "noelrohi59@gmail.com") return null;
  const seriesStatus: "not_upserted" | "upserted" | "not_exists" =
    existsInDb && !results?.description
      ? "not_upserted"
      : results?.description
        ? "upserted"
        : "not_exists";
  return (
    <form
      className="mt-4 inline-flex justify-end"
      action={async (_: FormData) => {
        "use server";
        try {
          const res = await getDramaInfo(props.slug);
          const parse = infoSchema.safeParse(res);
          if (!parse.success)
            throw new Error("Schema doesn't match drama info.");
          const { data } = parse;

          const genres: string[] | undefined = data.genres?.map(
            (genre) => genre,
          );
          const otherNames: string[] | undefined = data.otherNames?.map(
            (name) => name,
          );

          const values: typeof series.$inferInsert = {
            coverImage: data.image,
            slug,
            title: data.title,
            description: data.description,
            releaseDate: String(data.releaseDate),
            status: data._status,
            genres,
            otherNames,
          };

          const episodeCount = data.episodes?.length ?? 0;
          console.log({ episodeCount });
          const episodes: (typeof episode.$inferInsert)[] =
            data.episodes?.map((ep) => ({
              dramaId: slug,
              episodeSlug: ep.id,
              number: ep.episode,
              title: ep.title,
              isLast:
                ep.episode === episodeCount && values.status === "completed",
              subType: ep.subType,
            })) ?? [];

          await db.transaction(async (tx) => {
            await tx.insert(series).values(values).onDuplicateKeyUpdate({
              set: values,
            });

            if (episodes.length > 0) {
              await tx.delete(episode).where(eq(episode.dramaId, slug));
              await tx.insert(episode).values(episodes);
            }
          });
          revalidatePath(`/drama/${props.slug}`);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <SubmitButton
        className={
          seriesStatus === "upserted"
            ? "bg-destructive text-destructive-foreground"
            : ""
        }
        // disabled={seriesStatus === "upserted"}
      >
        {seriesStatus === "not_upserted" ? (
          "Upsert"
        ) : seriesStatus === "upserted" ? (
          "Upserted"
        ) : (
          <>
            <Icons.plus className="size-4" /> Add to db
          </>
        )}
      </SubmitButton>
    </form>
  );
}

async function LastPlayedEpisode({ slug }: { slug: string }) {
  const auth = await userSession();
  if (!auth) return null;

  const watchlistData = await db.query.watchList.findFirst({
    where: and(
      eq(watchList.dramaId, `drama-detail/${slug}`),
      eq(watchList.userId, auth.user.id),
    ),
    with: {
      series: {
        columns: {
          id: true,
        },
        with: {
          episodes: {
            columns: {
              episodeSlug: true,
              number: true,
            },
            orderBy: [asc(episode.number)],
          },
        },
      },
    },
  });
  if (!watchlistData || watchlistData.status === "finished") return null;
  const episodes = watchlistData.series.episodes;
  const episodeIndex = episodes.findIndex(
    (e) => e.number === watchlistData.episode,
  );
  const episodeData = episodes.find((_, index) => index === episodeIndex + 1);
  const episodeNumber = episodeData?.number ?? 1;
  return (
    <Link
      href={episodeData ? `/watch/${episodeData?.episodeSlug}` : "#"}
      className={cn(buttonVariants(), "w-full")}
    >
      {episodeNumber === 1 ? "Watch" : "Continue"} episode {episodeNumber}
    </Link>
  );
}

const userSession = cache(async () => {
  return await auth();
});
