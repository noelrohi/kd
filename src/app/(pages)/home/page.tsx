import { Card as DramaCard } from "@/components/card";
import { FallBackCard as FallBack } from "@/components/fallbacks/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeatured, getRecent, getTrending } from "@/lib/dramacool";
import { getWatchLists } from "@/lib/helpers/server";
import { generateMetadata } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const title = "Home";
const description = "Explore popular and airing kdrama series";

export const metadata = generateMetadata({ title, description });

export default function Page() {
  return (
    <>
      <section className="mx-auto w-screen px-4 py-4 lg:container lg:py-10">
        <Suspense
          fallback={
            <AspectRatio ratio={16 / 5} className="relative">
              <Skeleton className="size-full" />
            </AspectRatio>
          }
        >
          <FeaturedDramas />
        </Suspense>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">
              Watch list
            </h2>
            <p className="text-muted-foreground text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              <Suspense fallback={<FallBack />}>
                <WatchList />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Recent</h2>
            <p className="text-muted-foreground text-sm">
              Freshly aired drama episodes that have been recently released.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              <Suspense fallback={<FallBack />}>
                <Recent />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Popular</h2>
            <p className="text-muted-foreground text-sm">
              Most anticipated and popular drama series.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              <Suspense fallback={<FallBack />}>
                <Trending />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>
    </>
  );
}

async function FeaturedDramas() {
  const featured = await getFeatured();
  return (
    <Carousel className="w-full overflow-hidden">
      <CarouselContent>
        {featured?.map((item) => (
          <CarouselItem key={item.id} className="basis-full">
            <Link href={`/drama/${item.id.replace("drama-detail/", "")}`}>
              <AspectRatio ratio={16 / 5} className="relative">
                <Image src={item.image} alt={item.title} fill />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
                <div className="absolute bottom-0 mb-4 w-full text-center font-heading text-lg lg:text-2xl">
                  {item.title}
                </div>
              </AspectRatio>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

async function Recent() {
  const recentEpisodes = await getRecent();
  return (
    <>
      {recentEpisodes?.results?.map((ep, index) => (
        <DramaCard
          key={index}
          prefetch={false}
          data={{
            title: ep.title,
            image: ep.image,
            description: `Episode ${ep.number}`,
            link: `watch/${ep.id}`,
            // slug: ep.id.replace("drama-detail/", ""),
          }}
          className="w-28 lg:w-[250px]"
          aspectRatio="portrait"
          width={250}
          height={330}
        />
      ))}
    </>
  );
}

async function Trending() {
  const topAiring = await getTrending();
  return (
    <>
      {topAiring?.results?.map((drama, index) => (
        <DramaCard
          key={index}
          data={{
            title: drama.title,
            image: drama.image,
            description: "",
            slug: drama.id.replace("drama-detail/", ""),
          }}
          className="w-28 lg:w-[250px]"
          aspectRatio="portrait"
          width={250}
          height={330}
        />
      ))}
    </>
  );
}

async function WatchList() {
  const watchlists = await getWatchLists();
  // This results to list of 'watching' or 'planned' status of auth'd users or cookie based watchlists only
  const filteredList = watchlists.filter((l) =>
    [null, "watching", "plan_to_watch"].includes(l.status),
  );
  return (
    <>
      {filteredList.length === 0 && (
        <p className="mt-2 italic">
          No watchlists. Try adding some by going to a series page and click{" "}
          <span className="font-bold text-blue-700 not-italic">
            Add to watchlist
          </span>
          .
        </p>
      )}
      {filteredList.map(({ series: drama }, index) => {
        if (!drama) return null;
        return (
          <DramaCard
            key={index}
            data={{
              title: drama.title,
              image: drama.coverImage,
              description: "",
              slug: drama.slug.replace("drama-detail/", ""),
            }}
            className="w-28 lg:w-[250px]"
            aspectRatio="portrait"
            width={250}
            height={330}
          />
        );
      })}
    </>
  );
}
