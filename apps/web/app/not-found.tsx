"use client";

import type { Metadata } from "next";
import { ErrorMessage } from "@repo/ui/web";

const title = "404 | Not Found";
const description = "This page doesn't exist.";
const link = "https://deepshaswat.com/not-found";
const image = "https://deepshaswat.com/static/images/headShot.png";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/not-found",
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

export default function Custom404(): JSX.Element {
  return <ErrorMessage code={404} />;
}
