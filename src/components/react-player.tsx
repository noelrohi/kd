"use client";

import ReactPlayer, { ReactPlayerProps } from "react-player";
import { Icons } from "./icons";
import { OnProgressProps } from "react-player/base";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { updateProgress } from "@/lib/actions";

interface Props extends ReactPlayerProps {
  slug: string;
  number: number;
  authenticated: boolean;
}

export default function ReactPlayerAsVideo({
  slug,
  url,
  number,
  authenticated,
}: Props) {
  let storageName = `kd-${slug}-${number}`;
  const [media, setMedia, rmMedia] = useLocalStorage(storageName, "");
  const parsedStoredItem: OnProgressProps = media
    ? JSON.parse(media)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };
  const [isSeeking, setIsSeeking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [progress, setProgress] = useState<OnProgressProps>(parsedStoredItem);
  const [playbackRate, setPlaybackRate] = useLocalStorage(
    "kd-playbackrate",
    "1"
  );
  const handlePause = () => {
    setMedia(JSON.stringify(progress));
  };

  const handleEnded = () => {
    if (!isEnded) {
      setIsEnded(true);
      rmMedia();
    }
  };
  const searchParams = useSearchParams();
  const seek = searchParams.get("seek")
    ? Number(searchParams.get("seek"))
    : progress.playedSeconds;

  const handleReady = (player: ReactPlayer) => {
    if (isSeeking) {
      return;
    }
    player.seekTo(seek);
  };
  const [isPending, startTransition] = useTransition();
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    console.log({ isEnding });
    if (isEnding) {
      toast(`Set your progress for this drama to ${number}?`, {
        duration: 1000 * 60 * 20,
        action: {
          label: "Yes",
          onClick: () => {
            toast.loading("Updating your progress.", { id: 1 });
            startTransition(async () => {
              const res = await updateProgress({ episode: number, slug });
              toast.dismiss(1);
              if (res.error) toast.error(res.message);
              if (!res.error)
                toast.success("Successfully updated your progress.");
            });
          },
        },
      });
    }
  }, [isEnding]);

  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      controls={true}
      loop={false}
      onEnded={handleEnded}
      onReady={handleReady}
      onSeek={(number) => {
        setIsSeeking(true);
      }}
      onProgress={(state) => {
        let almostEnd = state.played > 0.89;
        setIsEnding(almostEnd);
        setProgress({ ...state, playedSeconds: state.playedSeconds });
      }}
      onDuration={(number) => {
        setProgress({ ...progress, loadedSeconds: number });
      }}
      onPause={handlePause}
      onBuffer={handlePause}
      onPlaybackRateChange={(speed: number) => {
        setPlaybackRate(String(speed));
      }}
      playIcon={<Icons.play />}
    />
  );
}
