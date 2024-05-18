import { env } from "@/env.mjs";
import { type ClassValue, clsx } from "clsx";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const url = env.VERCEL_URL || env.NEXT_PUBLIC_APP_URL;
  return path.startsWith("/") ? url + path : `${url}/${path}`;
}

export function generateMetadata({
  description,
  title,
  opengraphImage = absoluteUrl("/opengraph-image.png"),
}: {
  title: string;
  description: string;
  opengraphImage?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl("/home"),
      images: [
        {
          url: opengraphImage,
          width: 1200,
          height: 630,
          alt: "home opengraph image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [opengraphImage],
    },
  };
}
