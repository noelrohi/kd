import { Card } from "@/components/card";
import { FallBackCard as FallBack } from "@/components/fallbacks/card";
import { Loading } from "@/components/fallbacks/loading";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getRecent, getTrending } from "@/lib/dramacool";
import { getWatchLists } from "@/lib/helpers/server";
import { generateMetadata } from "@/lib/utils";
import { Suspense } from "react";

interface PageProps {}

const title = "Home";
const description = "Explore popular and airing kdrama series";

export const metadata = generateMetadata({ title, description });

export default function Page({}: PageProps) {
  return (
    <>
      <section className="mx-auto px-4 lg:container py-4 lg:py-10">
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

async function Recent() {
  const recentEpisodes = await getRecent();
  return (
    <>
      {recentEpisodes?.results?.map((ep, index) => (
        <Card
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
        <Card
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
  const results = await getWatchLists();
  return (
    <>
      {results.length === 0 && (
        <p className="mt-2 italic">
          No watchlists. Try adding some by going to a series page and click{" "}
          <span className="font-bold not-italic text-blue-700">
            Add to watchlist
          </span>
          .
        </p>
      )}
      {results.map(({ series: drama }, index) => {
        if (!drama) return null;
        return (
          <Card
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
