import { Card } from "@/components/card";
import { FallBackCard } from "@/components/fallbacks/card";
import { Icons } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { search } from "@/lib/dramacool";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

interface SearchPageProps {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
}

const searchParamsSchema = z.object({
  q: z.string().optional(),
});

export default function SearchPage(props: SearchPageProps) {
  const searchParams = searchParamsSchema.parse(props.searchParams);
  return (
    <section className="py-8 space-y-4">
      <form
        action={async (data: FormData) => {
          "use server";
          const q = (data.get("dramaSeries") as string) ?? undefined;
          revalidatePath("/search");
          redirect(`/search?q=${q}`);
        }}
        className="relative max-w-lg block lg:hidden"
      >
        <Input
          placeholder="Search series ..."
          name="dramaSeries"
          defaultValue={searchParams.q}
        />
        <div className="absolute top-2 right-2">
          <Button
            size={"icon"}
            className="h-5 w-5"
            variant={"ghost"}
            type="submit"
          >
            <Icons.search />
          </Button>
        </div>
      </form>

      {!!searchParams.q && (
        <>
          <Typography as={"h1"} variant={"h3"}>
            Search results for{" "}
            <span className="italic text-blue-500">{searchParams.q}</span>
          </Typography>
        </>
      )}
      <div className="flex flex-wrap gap-2">
        <Suspense
          key={searchParams.q}
          fallback={<FallBackCard aspectRatio="square" />}
        >
          <SearchResults query={searchParams.q} />
        </Suspense>
      </div>
      {!searchParams.q && (
        <div className="min-h-[50vh] flex justify-center items-center text-3xl font-semibold">
          No series, try searching some ..
        </div>
      )}
    </section>
  );
}

async function SearchResults({ query }: { query: string | undefined }) {
  if (!query) return null;
  const data = await search({ query });
  return (
    <>
      {data?.results.length === 0 && "No results for this query."}
      {data?.results.map((drama, index) => (
        <Card
          key={index}
          data={{
            title: drama.title,
            image: drama.image,
            description: ``,
            slug: drama.id.replace("drama-detail/", ""),
          }}
          className="lg:w-[250px] w-28"
          aspectRatio="square"
          width={250}
          height={330}
        />
      ))}
    </>
  );
}
