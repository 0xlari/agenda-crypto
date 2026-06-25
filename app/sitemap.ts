import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/supabase/queries";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/agenda"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/divulgacao"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/producao-de-eventos"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const events = await getPublishedEvents();
  const eventRoutes: MetadataRoute.Sitemap = events
    .filter((event) => event.slug)
    .map((event) => ({
      url: absoluteUrl(`/agenda/${event.slug}`),
      lastModified: event.updated_at ? new Date(event.updated_at) : now,
      changeFrequency: "weekly",
      priority: event.featured ? 0.9 : 0.8,
    }));

  return [...staticRoutes, ...eventRoutes];
}
