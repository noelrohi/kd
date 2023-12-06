import { getEpisodeInfo, getEpisodeSources } from "@/lib/dramacool";
import { episodeSourceSchema } from "@/lib/validations";
import dynamic from "next/dynamic";
import GoBack from "./go-back";
import { Typography } from "@/components/typography";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    slug: string;
  };
}

const VideoPlayer = dynamic(() => import("@/components/react-player"), {
  ssr: false,
});

export default async function Page({ params }: PageProps) {
  const episodeInfo = await getEpisodeInfo(params.slug);
  if (!episodeInfo) throw new Error("Episode info not found!");
  const { downloadLink, dramaId, episodes, id, title, number } = episodeInfo;
  return (
    <section className="p-4 lg:container space-y-2">
      <GoBack />
      <div className="lg:h-1/2">
        <AspectRatio ratio={16 / 9}>
          <Vid slug={params.slug} />
        </AspectRatio>
      </div>
      <Typography as={"h1"} variant={"h2"} className="border-b mb-2 p-2">
        {title} | Episode {number}
      </Typography>
      <div className="flex gap-4">
        {episodes.previous && (
          <Link href={`/watch/${episodes.previous}`}>
            <Button size={"sm"}>Previous</Button>
          </Link>
        )}
        {episodes.next && (
          <Link href={`/watch/${episodes.next}`}>
            <Button size={"sm"}>Next</Button>
          </Link>
        )}
      </div>
      {/* <div className="break-all">{JSON.stringify(parsed)}</div> */}
    </section>
  );
}

type Props = { slug: string };
async function Vid({ slug }: Props) {
  const episodeSources = await getEpisodeSources(slug);
  const parsed = episodeSourceSchema.parse(episodeSources);
  return <VideoPlayer url={parsed.sources[0].url} />;
}
