import { Metadata } from "next";

import { generateSiteConfig, NewsletterUnsubscribe } from "@repo/ui/web";
import { Reminder } from "@repo/ui/web";

export const metadata: Metadata = generateSiteConfig(
  "Unsubscribe from Newsletter // Shaswat Deep",
  "We're sorry to see you go. Please enter your email to unsubscribe from our newsletter.",
  "/unsubscribe",
  "/static/images/reminder-bw.jpg"
);

const NewsletterUnsubscribePage = () => {
  return <NewsletterUnsubscribe />;
};

export default NewsletterUnsubscribePage;
