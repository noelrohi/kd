import { Typography } from "@/components/typography";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { getEpisodeInfo, getEpisodeSources } from "@/lib/dramacool";
import { episodeSourceSchema } from "@/lib/validations";
import dynamic from "next/dynamic";
import Link from "next/link";

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
      <Link href={`/drama/${dramaId.split("/")[1]}`}>
        <Button variant={"outline"} size={"sm"}>
          View Drama Series
        </Button>
      </Link>
      <div className="lg:h-1/2">
        <AspectRatio ratio={16 / 9}>
          <Vid slug={params.slug} number={number} />
        </AspectRatio>
      </div>
      <Typography as={"h1"} variant={"h2"} className="border-b mb-2 p-2">
        {title} | Episode {number}
      </Typography>
      <div className="flex gap-1">
        <Button size={"sm"} disabled={!episodes.previous}>
          <Link href={`/watch/${episodes.previous}`}>Previous</Link>
        </Button>
        <Button size={"sm"} variant={"outline"}>
          {number}
        </Button>
        <Button size={"sm"} disabled={!episodes.next}>
          <Link href={`/watch/${episodes.next}`}>Next</Link>
        </Button>
      </div>
      <div>
        <Button size={"sm"} variant={"secondary"}>
          <Link href={downloadLink} download>
            Download
          </Link>
        </Button>
      </div>
      {/* <div className="break-all">{JSON.stringify(parsed)}</div> */}
    </section>
  );
}

type Props = { slug: string; number: number };
async function Vid({ slug, number }: Props) {
  const episodeSources = await getEpisodeSources(slug);
  const parsed = episodeSourceSchema.parse(episodeSources);
  return (
    <VideoPlayer url={parsed.sources[0].url} slug={slug} number={number} />
  );
}
