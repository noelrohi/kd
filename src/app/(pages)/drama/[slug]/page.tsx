import { Card } from "@/components/card";
import { Icons } from "@/components/icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getDramaInfo } from "@/lib/dramacool";
import {
  existingFromDatabase,
  getWatchLists,
  popFromWatchList,
  pushToWatchList,
} from "@/lib/helpers/server";
import { cn } from "@/lib/utils";
import { infoSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SubmitButton } from "./client";
import { Typography } from "@/components/typography";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  let data = await getDramaInfo(params.slug);
  const parsed = infoSchema.parse(data);
  let { description, episodes, id, image, otherNames, releaseDate, title } =
    parsed;
  return (
    <section className="py-12 space-y-4">
      <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        <WatchListed dramaSeries={parsed} />
      </div>
      <Typography as={"h4"} variant={"h4"} className="text-muted-foreground">
        <strong className="text-foreground">Other Names:</strong>{" "}
        {otherNames.join(", ")}
      </Typography>
      <p className="leading-7 [&:not(:first-child)]:mt-6 indent-10">
        {description}
      </p>
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
  const existsInDb = await existingFromDatabase(slug);
  if (!existsInDb)
    return (
      <p className="text-destructive max-w-xs text-sm text-right">
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
