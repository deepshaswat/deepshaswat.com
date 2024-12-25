import { fetchAllPosts } from "@repo/actions";
import { ArticlesListPage } from "@repo/ui/web";
import { generateSiteConfig } from "@repo/ui/web";
import { Metadata } from "next";

// const

export const metadata: Metadata = generateSiteConfig(
  "Articles // Shaswat Deep",
  "Shaswat Deep is an Indian software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  "/articles",
  "/static/images/reminder-bw.jpg",
);

const ArticlesPage = async () => {
  return <ArticlesListPage />;
};

export default ArticlesPage;
