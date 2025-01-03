import { MetadataRoute } from "next";
import { fetchPublishedPosts } from "@repo/actions";
import type { PostListType } from "@repo/actions";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://deepshaswat.com";

type RouteConfig = {
  path: string;
  priority: number;
  freq: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Static routes with optimized priorities and frequencies
    const staticRoutes: RouteConfig[] = [
      { path: "", priority: 1.0, freq: "daily" }, // Homepage
      { path: "/about", priority: 0.8, freq: "monthly" }, // About page changes less frequently
      { path: "/articles", priority: 0.9, freq: "daily" }, // Articles list page
      { path: "/contact", priority: 0.7, freq: "monthly" },
      { path: "/investing", priority: 0.8, freq: "weekly" },
      { path: "/library", priority: 0.8, freq: "weekly" },
      { path: "/links", priority: 0.7, freq: "monthly" },
      { path: "/newsletter", priority: 0.9, freq: "daily" }, // Newsletter list page
      { path: "/projects", priority: 0.8, freq: "weekly" },
      { path: "/reminder", priority: 0.6, freq: "monthly" },
      { path: "/uses", priority: 0.7, freq: "monthly" },
    ];

    const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.freq,
      priority: route.priority,
    }));

    // Fetch published articles
    let articles: PostListType[] = [];
    try {
      articles = await fetchPublishedPosts("articles");
    } catch (error) {
      console.error("Error fetching articles:", error);
    }

    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => {
      const publishDate = article.publishDate
        ? new Date(article.publishDate)
        : new Date();
      const timeSincePublish = new Date().getTime() - publishDate.getTime();
      const isRecent = timeSincePublish < 7 * 24 * 60 * 60 * 1000; // 7 days
      const isWithinMonth = timeSincePublish < 30 * 24 * 60 * 60 * 1000; // 30 days

      return {
        url: `${BASE_URL}/${article.postUrl}`,
        lastModified: article.updatedAt || new Date(),
        changeFrequency: (article.featured || isRecent
          ? "daily"
          : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: article.featured ? 0.9 : isWithinMonth ? 0.8 : 0.6,
      };
    });

    // Fetch published newsletters
    let newsletters: PostListType[] = [];
    try {
      newsletters = await fetchPublishedPosts("newsletters");
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    }

    const newsletterRoutes: MetadataRoute.Sitemap = newsletters.map(
      (newsletter) => {
        const publishDate = newsletter.publishDate
          ? new Date(newsletter.publishDate)
          : new Date();
        const timeSincePublish = new Date().getTime() - publishDate.getTime();
        const isRecent = timeSincePublish < 7 * 24 * 60 * 60 * 1000; // 7 days
        const isWithinMonth = timeSincePublish < 30 * 24 * 60 * 60 * 1000; // 30 days

        return {
          url: `${BASE_URL}/${newsletter.postUrl}`,
          lastModified: newsletter.updatedAt || new Date(),
          changeFrequency: (isRecent
            ? "daily"
            : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
          priority: isWithinMonth ? 0.8 : 0.6,
        };
      },
    );

    return [...routes, ...articleRoutes, ...newsletterRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return only static routes if there's an error
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
