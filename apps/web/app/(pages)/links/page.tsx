import { Metadata } from "next";

import { LinksComponent } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Links // Shaswat Deep";
const description =
  "Links to social media profiles, companies, projects and other websites of Shaswat Deep.";

const link = "https://deepshaswat.com/links";
const image = "https://deepshaswat.com/static/images/links.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/links",
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

const LinksPage = () => {
  return <LinksComponent />;
};

export default LinksPage;
