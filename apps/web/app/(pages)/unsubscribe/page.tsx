import { Metadata } from "next";

import { NewsletterUnsubscribe } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Unsubscribe from Newsletter // Shaswat Deep";
const description =
  "We're sorry to see you go. Please enter your email to unsubscribe from our newsletter.";
const link = "https://deepshaswat.com/unsubscribe";
const image = "/static/images/unsubscribe.jpg";
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

const NewsletterUnsubscribePage = () => {
  return <NewsletterUnsubscribe />;
};

export default NewsletterUnsubscribePage;
