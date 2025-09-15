import { About } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

const title = "About // Shaswat Deep";
const description =
  "Shaswat Deep is a builder, entrepreneur, and conspiracy theorist. He is building products called RateCreator & VibeCreation for Creator Economy and Naviya & Ship for AI Native solutions.";
const link = "https://deepshaswat.com/about";
const image = "https://deepshaswat.com/static/images/about.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about",
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

const AboutPage = () => {
  return <About />;
};

export default AboutPage;
