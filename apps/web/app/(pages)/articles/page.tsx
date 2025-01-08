import { ArticlesListPage } from "@repo/ui/web";
import { generateSiteConfig } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

export const metadata: Metadata = generateSiteConfig(
  "Articles // Shaswat Deep",
  "Shaswat Deep is an Indian software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  "/articles",
  "/static/images/headShot.svg",
);

const ArticlesPage = async () => {
  return <ArticlesListPage />;
};

export default ArticlesPage;
