import { Metadata } from "next";

const ALT_TITLE = "deepshaswat.com";
const BASE_URL = "https://test.deepshaswat.com";

// Function to generate site configuration dynamically with default values and optional URL suffix
export function generateSiteConfig(
  title: string = "Shaswat Deep",
  description: string = "deepshaswat.com",
  urlSuffix: string = "",
  image_url: string = "/static/images/reminder-bw.jpg",
): Metadata {
  const fullUrl = `${BASE_URL}${urlSuffix}`;

  return {
    title: title,
    description: description,
    icons: {
      icon: "/favicon.ico",
    },
    applicationName: "deepshaswat.com",
    creator: "Shaswat Deep",
    twitter: {
      creator: "@shaswat_X",
      title: title,
      description: description,
      card: "summary_large_image",
      images: [
        {
          url: image_url,
          width: 1200,
          height: 630,
          alt: ALT_TITLE,
        },
      ],
    },
    openGraph: {
      title: title,
      description: description,
      siteName: "deepshaswat.com",
      url: fullUrl,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image_url,
          width: 1200,
          height: 630,
          alt: ALT_TITLE,
        },
      ],
    },
    category: "Technology",
    alternates: {
      canonical: fullUrl,
    },
    keywords: ["Technology", "Blogging"],
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
