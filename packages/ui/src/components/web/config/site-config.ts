import { Metadata } from "next";

const ALT_TITLE = "deepshaswat.com";
const BASE_URL = "https://deepshaswat.com";

interface ExtendedMetadata {
  metadataTitle?: string;
  metadataDescription?: string;
  metadataImageUrl?: string;
  metadataKeywords?: string;
  metadataAuthorName?: string;
  metadataCanonicalUrl?: string;
  metadataOgTitle?: string;
  metadataOgDescription?: string;
  metadataOgImage?: string;
  metadataTwitterCard?: "summary_large_image" | "summary" | "player" | "app";
  metadataTwitterTitle?: string;
  metadataTwitterDescription?: string;
  metadataTwitterImage?: string;
}

// Function to generate site configuration dynamically with default values and optional URL suffix
export function generateSiteConfig(
  title: string = "Shaswat Deep",
  description: string = "Shaswat Deep is software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  urlSuffix: string = "",
  image_url: string = "/static/images/headShot.svg",
  extendedMetadata?: ExtendedMetadata,
): Metadata {
  const fullUrl = `${BASE_URL}${urlSuffix}`;

  return {
    title: extendedMetadata?.metadataTitle || title,
    description: extendedMetadata?.metadataDescription || description,
    icons: {
      icon: "/favicon.ico",
    },
    applicationName: "deepshaswat.com",
    creator: extendedMetadata?.metadataAuthorName || "Shaswat Deep",
    twitter: {
      creator: "@shaswat_X",
      title: extendedMetadata?.metadataTwitterTitle || title,
      description: extendedMetadata?.metadataTwitterDescription || description,
      card: extendedMetadata?.metadataTwitterCard || "summary_large_image",
      images: [
        {
          url: extendedMetadata?.metadataTwitterImage || image_url,
          width: 1200,
          height: 630,
          alt: ALT_TITLE,
        },
      ],
    },
    openGraph: {
      title: extendedMetadata?.metadataOgTitle || title,
      description: extendedMetadata?.metadataOgDescription || description,
      siteName: "deepshaswat.com",
      url: fullUrl,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: extendedMetadata?.metadataOgImage || image_url,
          width: 1200,
          height: 630,
          alt: ALT_TITLE,
        },
      ],
    },
    category:
      extendedMetadata?.metadataKeywords?.split(",")[0] || "Entrepreneurship",
    alternates: {
      canonical: extendedMetadata?.metadataCanonicalUrl || fullUrl,
    },
    keywords: extendedMetadata?.metadataKeywords?.split(",") || [
      "Technology",
      "Blogging",
      "Entrepreneurship",
    ],
    metadataBase: new URL(fullUrl),
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
