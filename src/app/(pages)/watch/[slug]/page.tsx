import { getEpisodeSources } from "@/lib/dramacool";
import { episodeSourceSchema } from "@/lib/validations";
import dynamic from "next/dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

const VideoPlayer = dynamic(() => import("@/components/react-player"), {
  ssr: false,
});

export default async function Page({ params }: PageProps) {
  const episodeSources = await getEpisodeSources(params.slug);
  const parsed = episodeSourceSchema.parse(episodeSources);
  return (
    <>
      <VideoPlayer url={parsed.sources[parsed.sources.length - 1].url} />
    </>
  );
}
