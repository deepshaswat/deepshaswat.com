import type { MetadataRoute } from "next";
import { fetchPublishedPosts } from "@repo/actions";
import type { PostListType } from "@repo/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deepshaswat.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/articles",
    "/contact",
    "/investing",
    "/library",
    "/links",
    "/newsletter",
    "/projects",
    "/reminder",
    "/unsubscribe",
    "/uses",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch published articles
  let articles: PostListType[] = [];
  try {
    articles = await fetchPublishedPosts("articles");
  } catch {
    // Error fetching articles - continue with empty array
  }

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/${article.postUrl}`,
    lastModified: article.publishDate
      ? new Date(article.publishDate)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: article.featured ? 0.9 : 0.7,
  }));

  // Fetch published newsletters
  let newsletters: PostListType[] = [];
  try {
    newsletters = await fetchPublishedPosts("newsletters");
  } catch {
    // Error fetching newsletters - continue with empty array
  }

  const newsletterRoutes = newsletters.map((newsletter) => ({
    url: `${baseUrl}/${newsletter.postUrl}`,
    lastModified: newsletter.publishDate
      ? new Date(newsletter.publishDate)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...articleRoutes, ...newsletterRoutes];
}
