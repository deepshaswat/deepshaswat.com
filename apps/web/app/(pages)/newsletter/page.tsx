import { NewsletterListPage } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

const title = "Newsletter // Shaswat Deep";
const description =
  "Shaswat Deep is a builder, entrepreneur, and conspiracy theorist. He writes about stock market, investing, entrepreneurship, personal finance and conspiracy theories.";
const link = "https://deepshaswat.com/newsletter";
const image = "https://deepshaswat.com/static/images/newsletter.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/newsletter",
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

const NewsletterPage = () => {
  return <NewsletterListPage />;
};

export default NewsletterPage;
