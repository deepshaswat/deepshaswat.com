import { MetadataRoute } from "next";
import { fetchPublishedPosts } from "@repo/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://deepshaswat.com";

  // Static routes with optimized priorities and frequencies
  const routes = [
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
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency:
      route.freq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: route.priority,
  }));

  // Fetch published articles
  const articles = await fetchPublishedPosts("articles");
  const articleRoutes = articles.map((article) => {
    const publishDate = article.publishDate
      ? new Date(article.publishDate)
      : new Date();
    const timeSincePublish = new Date().getTime() - publishDate.getTime();
    const isRecent = timeSincePublish < 7 * 24 * 60 * 60 * 1000; // 7 days
    const isWithinMonth = timeSincePublish < 30 * 24 * 60 * 60 * 1000; // 30 days

    return {
      url: `${baseUrl}/${article.postUrl}`,
      lastModified: article.updatedAt,
      changeFrequency:
        article.featured || isRecent
          ? "daily"
          : ("monthly" as MetadataRoute.Sitemap[number]["changeFrequency"]),
      priority: article.featured ? 0.9 : isWithinMonth ? 0.8 : 0.6,
    };
  });

  // Fetch published newsletters
  const newsletters = await fetchPublishedPosts("newsletters");
  const newsletterRoutes = newsletters.map((newsletter) => {
    const publishDate = newsletter.publishDate
      ? new Date(newsletter.publishDate)
      : new Date();
    const timeSincePublish = new Date().getTime() - publishDate.getTime();
    const isRecent = timeSincePublish < 7 * 24 * 60 * 60 * 1000; // 7 days
    const isWithinMonth = timeSincePublish < 30 * 24 * 60 * 60 * 1000; // 30 days

    return {
      url: `${baseUrl}/${newsletter.postUrl}`,
      lastModified: newsletter.updatedAt,
      changeFrequency: isRecent
        ? "daily"
        : ("monthly" as MetadataRoute.Sitemap[number]["changeFrequency"]),
      priority: isWithinMonth ? 0.8 : 0.6,
    };
  });

  return [...routes, ...articleRoutes, ...newsletterRoutes];
}
