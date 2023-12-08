import { Typography } from "@/components/typography";
import { getTrending } from "@/lib/dramacool";
import { Suspense } from "react";
import { InfiniteList } from "./client";
import { Button } from "@/components/ui/button";
import { FallBackCard } from "@/components/fallbacks/card";

export default function Page() {
  return (
    <section className="py-8 space-y-4 text-center">
      <Typography as={"h1"} variant={"h3"}>
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
      <Button className="w-full mt-4" variant={"secondary"} disabled>
        Load more
      </Button>
    </div>
  );
}
