import { Metadata } from "next";

import { Reminder } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Reminder // Shaswat Deep";
const description =
  "Time is the only thing that is finite. Rest all things can be bought, sold, or created. So, make the most of it.";

const link = "https://deepshaswat.com/reminder";
const image = "https://deepshaswat.com/static/images/reminder-bw.jpg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/reminder",
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

const ReminderPage = () => {
  return <Reminder />;
};

export default ReminderPage;
