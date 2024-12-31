import { fetchPublishedPosts } from "@repo/actions";

export async function GET() {
  const articles = await fetchPublishedPosts("articles");
  const newsletters = await fetchPublishedPosts("newsletters");

  // Filter content from last 48 hours
  const recentContent = [...articles, ...newsletters].filter((item) => {
    const publishDate = item.publishDate
      ? new Date(item.publishDate)
      : new Date();
    const timeSincePublish = new Date().getTime() - publishDate.getTime();
    return timeSincePublish < 48 * 60 * 60 * 1000; // 48 hours
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentContent
        .map(
          (item) => `
        <url>
          <loc>https://deepshaswat.com/${item.postUrl}</loc>
          <news:news>
            <news:publication>
              <news:name>Shaswat Deep</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${
              item.publishDate
                ? new Date(item.publishDate).toISOString()
                : new Date().toISOString()
            }</news:publication_date>
            <news:title>${item.title}</news:title>
            <news:keywords>${item.tags
              .map((tag) => tag.tagId)
              .join(",")}</news:keywords>
          </news:news>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
