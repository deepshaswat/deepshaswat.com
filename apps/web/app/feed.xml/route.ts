import { fetchPublishedPosts } from "@repo/actions";

export async function GET() {
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
        <title>Shaswat Deep</title>
        <link>https://deepshaswat.com</link>
        <description>Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder &amp; CEO of Orbizza.</description>
        <language>en</language>
        <atom:link href="https://deepshaswat.com/feed.xml" rel="self" type="application/rss+xml"/>
        ${allContent
          .map(
            (item) => `
          <item>
            <title><![CDATA[${item.title}]]></title>
            <link>https://deepshaswat.com/${item.postUrl}</link>
            <guid>https://deepshaswat.com/${item.postUrl}</guid>
            <pubDate>${
              item.publishDate?.toUTCString() ?? new Date().toUTCString()
            }</pubDate>
            <description><![CDATA[${item.excerpt}]]></description>
            ${
              item.featureImage
                ? `<image>
                    <url>${item.featureImage}</url>
                    <title>${item.title}</title>
                    <link>https://deepshaswat.com/${item.postUrl}</link>
                  </image>`
                : ""
            }
            <author>hi@deepshaswat.com (${item.author.name})</author>
            ${item.tags
              .filter((tag) => tag && tag.tagId)
              .map((tag) => `<category>${tag.tagId}</category>`)
              .join("")}
          </item>
        `
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
