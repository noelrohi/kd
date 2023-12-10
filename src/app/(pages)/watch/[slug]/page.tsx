import { Typography } from "@/components/typography";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getEpisodeInfo, getEpisodeSources } from "@/lib/dramacool";
import { episodeSourceSchema } from "@/lib/validations";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const episodeInfo = await getEpisodeInfo(params.slug);
    if (!episodeInfo) throw new Error("Episode info not found!");
    const title = `${episodeInfo.title} | Episode ${episodeInfo.number}`;
    const ogImage = `https://og.rohi.dev/general?title=${title}&textColor=fff&backgroundColorHex=000`;
    return {
      title,
      description: `Watch episode ${episodeInfo.number} of ${
        episodeInfo.title
      }. ${(await parent).description}`,
      openGraph: {
        images: [ogImage],
      },
    };
  } catch (error) {
    const { title, description } = await parent;
    return {
      title,
      description,
    };
  }
}

const VideoPlayer = dynamic(() => import("@/components/react-player"), {
  ssr: false,
});

export default async function Page({ params }: PageProps) {
  const episodeInfo = await getEpisodeInfo(params.slug);
  if (!episodeInfo) throw new Error("Episode info not found!");
  const { downloadLink, dramaId, episodes, id, title, number } = episodeInfo;
  return (
    <section className="mx-auto px-4 lg:container py-4 lg:py-10 space-y-6">
      <Link href={`/drama/${dramaId.split("/")[1]}`}>
        <Button variant={"outline"} size={"sm"}>
          View Drama Series
        </Button>
      </Link>
      <div className="lg:h-1/2">
        <AspectRatio ratio={16 / 9}>
          <Vid episodeSlug={params.slug} number={number} dramaId={dramaId} />
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

type Props = { episodeSlug: string; number: number; dramaId: string };
async function Vid({ episodeSlug, dramaId, number }: Props) {
  const episodeSources = await getEpisodeSources(episodeSlug);
  const session = await auth();
  const parsed = episodeSourceSchema.parse(episodeSources);
  return (
    <VideoPlayer
      url={parsed.sources[0].url}
      slug={episodeSlug}
      dramaId={dramaId}
      number={number}
      authenticated={!!session}
    />
  );
}
