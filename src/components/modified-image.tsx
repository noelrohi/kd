"use client";
import { placeholderImage } from "@/config/site";
import NextImage, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  errorText: string;
};

export function WithErrorImage(props: Props) {
  const [newSrc, setSrc] = useState(props.src);
  return (
    <NextImage
      {...props}
      src={newSrc}
      onError={() => setSrc(placeholderImage(props.errorText))}
    />
  );
}
