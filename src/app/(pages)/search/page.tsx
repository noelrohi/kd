import { Card } from "@/components/card";
import { FallBackCard } from "@/components/fallbacks/card";
import { Icons } from "@/components/icons";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { search } from "@/lib/dramacool";
import { generateMetadata } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

export const metadata = generateMetadata({
  title: "Search Drama Series",
  description: siteConfig.description,
  opengraphImage:
    "https://og.rohi.dev/general?title=K-NEXT - Search&textColor=fff&backgroundColorHex=000",
});

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
    <section className="mx-auto space-y-6 px-4 py-4 lg:container lg:py-10">
      <form
        action={async (data: FormData) => {
          "use server";
          const q = (data.get("dramaSeries") as string) ?? undefined;
          revalidatePath("/search");
          redirect(`/search?q=${q}`);
        }}
        className="relative block max-w-lg lg:hidden"
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
            <span className="text-blue-500 italic">{searchParams.q}</span>
          </Typography>
        </>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Suspense
          key={searchParams.q}
          fallback={<FallBackCard aspectRatio="square" />}
        >
          <SearchResults query={searchParams.q} />
        </Suspense>
      </div>
      {!searchParams.q && (
        <div className="w-full text-center font-semibold text-3xl">
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
            description: "",
            slug: drama.id.replace("drama-detail/", ""),
          }}
          className="w-28 lg:w-[250px]"
          aspectRatio="square"
          width={250}
          height={330}
        />
      ))}
    </>
  );
}
