import fs from "fs";
import path from "path";
import { fetchPublishedPosts } from "@repo/actions";
import type { PostListType } from "@repo/actions";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://deepshaswat.com";

async function generateSitemaps() {
  const baseUrl = BASE_URL;
  const outputDir = path.join(process.cwd(), "public");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    let articles: PostListType[] = [];
    let newsletters: PostListType[] = [];

    try {
      articles = await fetchPublishedPosts("articles");
    } catch (error) {
      console.error("Error fetching articles:", error);
    }

    try {
      newsletters = await fetchPublishedPosts("newsletters");
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    }

    const allPosts = [...articles, ...newsletters];
    console.log(`Total posts: ${allPosts.length}`);

    // Generate main sitemap with posts
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPosts
  .map((post) => {
    try {
      return `  <url>
    <loc>${baseUrl}/${post.postUrl}</loc>
    <lastmod>${post.publishDate ? new Date(post.publishDate).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    } catch (error) {
      console.error("Error processing post for sitemap:", error);
      return "";
    }
  })
  .filter(Boolean)
  .join("\n")}
</urlset>`;

    fs.writeFileSync(path.join(outputDir, "sitemap-posts.xml"), sitemap);
    console.log("Generated posts sitemap");
  } catch (error) {
    console.error("Error generating sitemaps:", error);
    throw error;
  }

  console.log("All sitemaps generated successfully!");
}

// Run the script
generateSitemaps()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error generating sitemaps:", error);
    process.exit(1);
  });
