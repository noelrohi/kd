"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { cacheProgressUpdate as updateProgress } from "@/lib/actions";
import { loglib } from "@loglib/tracker";
import { useState, useTransition } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { OnProgressProps } from "react-player/base";
import { Icons } from "./icons";

interface Props extends ReactPlayerProps {
  slug: string;
  number: number;
  dramaId: string;
  seekTo?: number;
}

export default function ReactPlayerAsVideo({
  slug,
  url,
  number,
  seekTo,
  dramaId,
}: Props) {
  const storageName = `kd-${slug}-${number}`;
  const initialMedia = JSON.stringify({
    loadedSeconds: 0,
    playedSeconds: 0,
    loaded: 0,
    played: 0,
  });
  const [media, setMedia, rmMedia] = useLocalStorage(storageName, initialMedia);
  const parsedStoredItem: OnProgressProps = JSON.parse(media);
  const [isSeeking, setIsSeeking] = useState(false);
  const [progress, setProgress] = useState<OnProgressProps>(parsedStoredItem);
  const [playbackRate, setPlaybackRate] = useLocalStorage(
    "kd-playbackrate",
    "1",
  );

  const seekSeconds = seekTo ?? progress.playedSeconds;

  const [_, startTransition] = useTransition();

  const handlePause = () => {
    setMedia(JSON.stringify(progress));
    startTransition(async () => {
      await updateProgress({
        episodeSlug: slug,
        seconds: progress.playedSeconds,
      });
    });
  };

  const handleEnded = () => {
    rmMedia();
  };

  const handleReady = (player: ReactPlayer) => {
    if (isSeeking) {
      return;
    }
    player.seekTo(seekSeconds);
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
      onPlay={() => loglib.track(`Playing ${dramaId}`, { title: slug })}
      playbackRate={Number(playbackRate)}
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
