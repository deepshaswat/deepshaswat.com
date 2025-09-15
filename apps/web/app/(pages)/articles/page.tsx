import { ArticlesListPage } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

const title = "Articles // Shaswat Deep";
const description =
  "Shaswat Deep is a builder, entrepreneur, and conspiracy theorist. He writes about stock market, investing, entrepreneurship, personal finance and conspiracy theories.";
const link = "https://deepshaswat.com/articles";
const image = "https://deepshaswat.com/static/images/articles.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title,
    description,
    siteName,
    url: link,
    locale,
    type,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
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
