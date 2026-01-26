import { fetchPublishedPosts } from "@repo/actions";
import type { PostListType } from "@repo/actions";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://deepshaswat.com";

export async function GET(): Promise<Response> {
  try {
    let articles: PostListType[] = [];
    let newsletters: PostListType[] = [];

    try {
      articles = await fetchPublishedPosts("articles");
    } catch {
      // Error fetching articles - continue with empty array
    }

    try {
      newsletters = await fetchPublishedPosts("newsletters");
    } catch {
      // Error fetching newsletters - continue with empty array
    }

    // Filter content from last 48 hours
    const recentContent = [...articles, ...newsletters].filter((item) => {
      try {
        const publishDate = item.publishDate
          ? new Date(item.publishDate)
          : new Date();
        const timeSincePublish = new Date().getTime() - publishDate.getTime();
        return timeSincePublish < 48 * 60 * 60 * 1000; // 48 hours
      } catch {
        return false;
      }
    });

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentContent
        .map((item) => {
          try {
            return `
        <url>
          <loc>${BASE_URL}/${item.postUrl}</loc>
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
            ${
              Array.isArray(item.tags) && item.tags.length > 0
                ? `<news:keywords>${item.tags
                    .map((tag) => tag.tagId)
                    .filter(Boolean)
                    .join(",")}</news:keywords>`
                : ""
            }
          </news:news>
        </url>
      `;
          } catch {
            return "";
          }
        })
        .filter(Boolean)
        .join("")}
    </urlset>`;

    return new Response(feed, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    // Return an empty but valid sitemap in case of error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      </urlset>`,
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  }
}
