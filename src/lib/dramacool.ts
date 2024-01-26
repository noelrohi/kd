import { env } from "@/env.mjs";
import { EpisodeInfo, Featured, Recent, Search, TopAiring } from "@/types";

export async function getDramaInfo(slug: string) {
  const url = `${env.API_URL}/info/drama-detail/${slug}`;
  const res = await fetch(url, {
    cache: "no-cache",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getEpisodeSources(episodeSlug: string) {
  const url = `${env.API_URL}/episode-source/${episodeSlug}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getEpisodeInfo(episodeSlug: string) {
  const url = `${env.API_URL}/episode/${episodeSlug}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: EpisodeInfo = await res.json();
  return data;
}

export async function getTrending(page = 1) {
  const url = `${env.API_URL}/top-airing?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: TopAiring = await res.json();
  return data;
}

export async function getFeatured() {
  const url = `${env.API_URL}/featured`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: Featured[] = await res.json();
  return data;
}

export async function getRecent(page = 1) {
  const url = `${env.API_URL}/recent?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: Recent = await res.json();
  return data;
}

export async function search({
  page = 1,
  query,
}: {
  page?: number;
  query: string;
}) {
  const url = new URL(`${env.API_URL}/search`);
  if (page) url.searchParams.append("page", String(page));
  url.searchParams.append("q", query);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data: Search = await res.json();
  return data;
}
