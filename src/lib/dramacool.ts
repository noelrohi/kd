import { Featured, Recent, Search, TopAiring } from "@/types";

const baseUrl = "https://api-ani.rohi.dev/api/dramacool";

export async function getDramaInfo(slug: string) {
  const url = `${baseUrl}/info/drama-detail/${slug}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getEpisodeSources(episodeSlug: string) {
  const url = `${baseUrl}/episode-source/${episodeSlug}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getTrending(page: number = 1) {
  const url = `${baseUrl}/top-airing?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: TopAiring = await res.json();
  return data;
}

export async function getFeatured() {
  const url = `${baseUrl}/featured`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: Featured[] = await res.json();
  return data;
}

export async function getRecent(page: number = 1) {
  const url = `${baseUrl}/recent?page=${page}`;
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
  const url = new URL(`${baseUrl}/search`);
  if (page) url.searchParams.append("page", String(page));
  url.searchParams.append("q", query);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data: Search = await res.json();
  return data;
}
