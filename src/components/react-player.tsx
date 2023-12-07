"use client";

import ReactPlayer, { ReactPlayerProps } from "react-player";
import { Icons } from "./icons";
import { OnProgressProps } from "react-player/base";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSearchParams } from "next/navigation";

export default function ReactPlayerAsVideo({
  slug,
  url,
  number,
}: ReactPlayerProps & { slug: string; number: number }) {
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
