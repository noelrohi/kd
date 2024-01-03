import { siteConfig } from "@/config/site";
import { db } from "@/db";
import { MetadataRoute } from "next";

// Update sitemap only once every 6 hours
export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await db.query.episode.findMany();
  const allSeries = await db.query.series.findMany();

  const staticPathsSitemapList: MetadataRoute.Sitemap = [
    "/home",
    "/popular",
    "/search",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "weekly",
    priority: 1,
    lastModified: new Date(),
  }));

  const episodeSitemapList: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `${siteConfig.url}/watch/${ep.episodeSlug}`,
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: new Date(),
  }));

  const seriesSitemapList: MetadataRoute.Sitemap = allSeries.map((series) => ({
    url: `${siteConfig.url}/drama/${series.slug.replace("drama-detail/", "")}`,
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: new Date(),
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticPathsSitemapList,
    ...seriesSitemapList,
    ...episodeSitemapList,
  ];
}
