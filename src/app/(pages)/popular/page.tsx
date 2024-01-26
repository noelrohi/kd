import { FallBackCard } from "@/components/fallbacks/card";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getTrending } from "@/lib/dramacool";
import { generateMetadata } from "@/lib/utils";
import { Suspense } from "react";
import { InfiniteList } from "./client";

export const metadata = generateMetadata({
  title: "Popular Drama Series",
  description: siteConfig.description,
  opengraphImage:
    "https://og.rohi.dev/general?title=K-NEXT - Popular&textColor=fff&backgroundColorHex=000",
});

export default function Page() {
  return (
    <section className="mx-auto space-y-6 px-4 py-4 lg:container lg:py-10">
      <Typography
        as={"h1"}
        variant={"h3"}
        className="text-center lg:text-start"
      >
        Currently Popular Drama Series
      </Typography>
      <Suspense key={Math.random()} fallback={<FallBack />}>
        <TrendingList />
      </Suspense>
    </section>
  );
}

async function TrendingList() {
  const data = await getTrending();
  if (!data) throw new Error("Failed to get trending series.");
  return <InfiniteList initialData={data} />;
}

function FallBack() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        <FallBackCard aspectRatio="square" />
      </div>
      <Button className="mt-4 w-full" variant={"secondary"} disabled>
        Load more
      </Button>
    </div>
  );
}
