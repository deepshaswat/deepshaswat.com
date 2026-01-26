"use client";

import type { Metadata } from "next";
import { ErrorMessage } from "@repo/ui/web";

const title = "500 | Ooops!";
const description = "Something isn't right.";
const link = "https://deepshaswat.com/error";
const image = "https://deepshaswat.com/static/images/headShot.png";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/error",
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

export default function Custom500(): JSX.Element {
  return <ErrorMessage />;
}
