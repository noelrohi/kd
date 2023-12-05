import { getEpisodeSources } from "@/lib/dramacool";
import { episodeSourceSchema } from "@/lib/validations";
import dynamic from "next/dynamic";
import GoBack from "./go-back";

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
    <section className="max-h-[calc(100vh-84px)]">
      <GoBack />
      <div className="flex-1">
        <VideoPlayer url={parsed.sources[0].url} />
      </div>
      {/* <div className="break-all">{JSON.stringify(parsed)}</div> */}
    </section>
  );
}
