"use client";

import { ErrorMessage } from "@repo/ui/web";
import React from "react";

import { Metadata } from "next";

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
  },
  twitter: {
    card: twitterCard,
    title,
    description,
    images: [image],
  },
};

const Custom404: React.FC = () => {
  return <ErrorMessage code={404} />;
};

export default Custom404;
