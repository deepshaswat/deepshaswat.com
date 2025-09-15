"use client";

import { ErrorMessage } from "@repo/ui/web";
import React from "react";

import { Metadata } from "next";

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
  },
  twitter: {
    card: twitterCard,
    title,
    description,
    images: [image],
  },
};

const Custom500: React.FC = () => {
  return <ErrorMessage />;
};

export default Custom500;
