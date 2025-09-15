import { ArticlesListPage } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

const title = "Articles // Shaswat Deep";
const description =
  "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.";
const link = "https://deepshaswat.com/articles";
const image = "/static/images/articles.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName,
    url: link,
    locale,
    type,
  },
  twitter: {
    card: twitterCard,
    title,
    description,
    images: [image],
  },
};

const ArticlesPage = async () => {
  return <ArticlesListPage />;
};

export default ArticlesPage;
