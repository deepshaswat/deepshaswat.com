import type { Metadata } from "next";
import { NewsletterUnsubscribe } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Unsubscribe from Newsletter // Shaswat Deep";
const description =
  "We're sorry to see you go. Please enter your email to unsubscribe from our newsletter.";
const link = "https://deepshaswat.com/unsubscribe";
const image = "https://deepshaswat.com/static/images/unsubscribe.jpg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/unsubscribe",
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

export default function NewsletterUnsubscribePage(): JSX.Element {
  return <NewsletterUnsubscribe />;
}
