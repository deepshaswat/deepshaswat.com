import type { Metadata } from "next";

export const revalidate = 31536000;

const title = "Investing // Shaswat Deep";
const description =
  "Shaswat Deep writes about the stock market, investing, and personal finance.";
const link = "https://www.deepshaswat.com/investing";
// No investing-specific OG image yet — use the site-wide fallback image.
const image = "https://www.deepshaswat.com/static/images/headShot.png";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/investing",
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

export default function InvestingPage(): JSX.Element {
  return <div>Investing</div>;
}
