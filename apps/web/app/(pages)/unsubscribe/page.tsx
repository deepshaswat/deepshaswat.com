import { Metadata } from "next";

import { generateSiteConfig, NewsletterUnsubscribe } from "@repo/ui/web";

export const revalidate = 31536000;
export const metadata: Metadata = generateSiteConfig(
  "Unsubscribe from Newsletter // Shaswat Deep",
  "We're sorry to see you go. Please enter your email to unsubscribe from our newsletter.",
  "/unsubscribe",
  "/static/images/headshot.svg",
);

const NewsletterUnsubscribePage = () => {
  return <NewsletterUnsubscribe />;
};

export default NewsletterUnsubscribePage;
