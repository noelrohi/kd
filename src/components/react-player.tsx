"use client";

import ReactPlayer, { ReactPlayerProps } from "react-player";
import { Icons } from "./icons";

export default function ReactPlayerAsVideo(props: ReactPlayerProps) {
  let { asset, url, poster, blurDataURL, ...rest } = props;
  let config = { file: { attributes: { poster } } };

  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      controls={true}
      loop={false}
      playIcon={<Icons.play />}
    />
  );
}
