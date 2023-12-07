import { Typography } from "@/components/typography";
import { getTrending } from "@/lib/dramacool";
import { Suspense } from "react";
import { InfiniteList } from "./client";

export default function Page() {
  return (
    <section className="py-8 space-y-4">
      <Typography as={"h1"} variant={"h3"}>
        Currently Popular Drama Series
      </Typography>
      <Suspense key={Math.random()} fallback={<>Loading results...</>}>
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
