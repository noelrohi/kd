import { Card } from "@/components/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getRecent, getTrending } from "@/lib/dramacool";
import { generateMetadata } from "@/lib/utils";

interface PageProps {}

const title = "Home";
const description = "Explore popular and airing kdrama series";

export const metadata = generateMetadata({ title, description });

export default function Page({}: PageProps) {
  return (
    <>
      <section className="mx-auto px-4 lg:container py-10">
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
              <Recent />
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
              <Trending />
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
            description: ``,
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
      {topAiring?.results?.map((ep, index) => (
        <Card
          key={index}
          data={{
            title: ep.title,
            image: ep.image,
            description: ``,
            slug: ep.id.replace("drama-detail/", ""),
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
