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
      <section className="mx-auto px-4 lg:container py-4 lg:py-10">
        <Suspense
          fallback={
            <AspectRatio ratio={16 / 5} className="relative">
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          }
        >
          <FeaturedDramas />
        </Suspense>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Watch list
            </h2>
            <p className="text-sm text-muted-foreground">
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
            <h2 className="text-2xl font-semibold tracking-tight">Recent</h2>
            <p className="text-sm text-muted-foreground">
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
            <h2 className="text-2xl font-semibold tracking-tight">Popular</h2>
            <p className="text-sm text-muted-foreground">
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
                <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20"></div>
                <div className="absolute bottom-0 mb-4 text-lg lg:text-2xl text-center w-full font-heading">
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
          data={{
            title: ep.title,
            image: ep.image,
            description: `Episode ${ep.number}`,
            link: `watch/${ep.id}`,
            // slug: ep.id.replace("drama-detail/", ""),
          }}
          className="lg:w-[250px] w-28"
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
            description: ``,
            slug: drama.id.replace("drama-detail/", ""),
          }}
          className="lg:w-[250px] w-28"
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
    [null, "watching", "plan_to_watch"].includes(l.status)
  );
  return (
    <>
      {filteredList.length === 0 && (
        <p className="mt-2 italic">
          No watchlists. Try adding some by going to a series page and click{" "}
          <span className="font-bold not-italic text-blue-700">
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
              description: ``,
              slug: drama.slug.replace("drama-detail/", ""),
            }}
            className="lg:w-[250px] w-28"
            aspectRatio="portrait"
            width={250}
            height={330}
          />
        );
      })}
    </>
  );
}
