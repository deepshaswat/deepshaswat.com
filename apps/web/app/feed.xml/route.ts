import { fetchPublishedPosts } from "@repo/actions";
import { siteConfig } from "../../lib/site-config";

export async function GET(): Promise<Response> {
  const articles = await fetchPublishedPosts("articles");
  const newsletters = await fetchPublishedPosts("newsletters");

  const allContent = [...articles, ...newsletters].sort((a, b) => {
    const dateA = a.publishDate?.getTime() ?? 0;
    const dateB = b.publishDate?.getTime() ?? 0;
    return dateB - dateA;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${siteConfig.name}</title>
        <link>${siteConfig.url}</link>
        <description>${siteConfig.description}</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
        <image>
          <url>${siteConfig.ogImage}</url>
          <title>${siteConfig.name}</title>
          <link>${siteConfig.url}</link>
        </image>
        ${allContent
          .map(
            (item) => `
          <item>
            <title><![CDATA[${item.title}]]></title>
            <link>${siteConfig.url}/${item.postUrl}</link>
            <guid isPermaLink="true">${siteConfig.url}/${item.postUrl}</guid>
            <pubDate>${
              item.publishDate?.toUTCString() ?? new Date().toUTCString()
            }</pubDate>
            <description><![CDATA[${item.excerpt}]]></description>
            ${
              item.featureImage
                ? `<enclosure url="${item.featureImage}" type="image/jpeg" />`
                : ""
            }
            <author>${siteConfig.author.email} (${item.author.name})</author>
            ${item.tags
              .filter((tag) => tag.tagId)
              .map((tag) => `<category>${tag.tagId}</category>`)
              .join("")}
          </item>
        `,
          )
          .join("")}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
