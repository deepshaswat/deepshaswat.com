import { Metadata } from "next";

const ALT_TITLE = "deepshaswat.com";
const BASE_URL = "https://deepshaswat.com";
const DEFAULT_DESCRIPTION =
  "Shaswat Deep is software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.";

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
  description: string = DEFAULT_DESCRIPTION,
  urlSuffix: string = "",
  image_url: string = "/static/images/headShot.svg",
  extendedMetadata?: ExtendedMetadata
): Metadata {
  const fullUrl = `${BASE_URL}${urlSuffix}`;
  const formattedTitle = `${extendedMetadata?.metadataTitle || title}${
    title === "Shaswat Deep" ? "" : ""
  }`;

  return {
    // Basic Metadata
    title: formattedTitle,
    description: extendedMetadata?.metadataDescription || description,
    applicationName: "deepshaswat.com",
    authors: [
      {
        name: extendedMetadata?.metadataAuthorName || "Shaswat Deep",
        url: BASE_URL,
      },
    ],
    creator: extendedMetadata?.metadataAuthorName || "Shaswat Deep",
    publisher: "Shaswat Deep",

    // Favicons and App Icons
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
      ],
    },

    // Manifest and Theme
    manifest: "/site.webmanifest",

    // Twitter Metadata
    twitter: {
      card: extendedMetadata?.metadataTwitterCard || "summary_large_image",
      site: "@shaswat_X",
      creator: "@shaswat_X",
      title: extendedMetadata?.metadataTwitterTitle || formattedTitle,
      description: extendedMetadata?.metadataTwitterDescription || description,
      images: [
        {
          url: extendedMetadata?.metadataTwitterImage || image_url,
          width: 1200,
          height: 630,
          alt: ALT_TITLE,
          type: "image/jpeg",
        },
      ],
    },

    // Open Graph Metadata
    openGraph: {
      title: extendedMetadata?.metadataOgTitle || formattedTitle,
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
          type: "image/jpeg",
        },
      ],
      countryName: "India",
    },

    // Additional Metadata
    category:
      extendedMetadata?.metadataKeywords?.split(",")[0] || "StockMarket",
    classification: "Personal Blog, Technology, Entrepreneurship",
    alternates: {
      canonical: extendedMetadata?.metadataCanonicalUrl || fullUrl,
      languages: {
        "en-US": fullUrl,
      },
    },
    keywords: extendedMetadata?.metadataKeywords?.split(",") || [
      "Technology",
      "Blogging",
      "Entrepreneurship",
      "Shaswat Deep",
      "Orbizza",
      "RateCreator",
      "StockMarket",
      "Investing",
      "Crypto",
      "Web3",
      "AI",
      "MachineLearning",
      "DeepLearning",
      "DataScience",
    ],

    // Verification and Base URL
    verification: {
      google: "google-site-verification=YOUR_CODE", // Add your Google verification code
    },
    metadataBase: new URL(fullUrl),

    // Robots and Crawling
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Additional app-specific metadata
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black",
      "format-detection": "telephone=no",
    },
  };
}
