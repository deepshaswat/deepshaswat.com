import type { Metadata } from "next";
import { Uses } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Uses // Shaswat Deep";
const description =
  "I often get messages asking about specific pieces of <strong>software or hardware I use</strong>. This not a static page, it's a <strong>living document</strong> with everything that I'm using nowadays.";
const link = "https://deepshaswat.com/uses";
const image = "https://deepshaswat.com/static/images/uses.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/uses",
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

export default function UsesPage(): JSX.Element {
  return <Uses />;
}
