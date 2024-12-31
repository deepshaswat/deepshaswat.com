import { generateSiteConfig, NewsletterListPage } from "@repo/ui/web";
import { Metadata } from "next";

export const metadata: Metadata = generateSiteConfig(
  "Newsletter // Shaswat Deep",
  "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  "/newsletter",
  "/static/images/headShot.svg",
);

const NewsletterPage = () => {
  return <NewsletterListPage />;
};

export default NewsletterPage;
