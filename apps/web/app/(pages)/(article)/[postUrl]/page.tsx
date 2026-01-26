import type { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@repo/db/client";

const BlogContent = dynamic(
  () => import("@repo/ui/web").then((m) => m.BlogContent),
  {
    ssr: false,
    loading: () => null,
  },
);

export const revalidate = 31536000;

export async function generateMetadata({
  params,
}: {
  params: { postUrl: string };
}): Promise<Metadata> {
  // Fetch post data server-side
  const post = await prisma.post.findUnique({
    where: { postUrl: params.postUrl },
    include: {
      tags: true,
      author: true,
    },
  });

  const title = `${post?.title ?? ""} // Shaswat Deep`;
  const description =
    post?.metadataDescription ||
    `Shaswat Deep is a builder, entrepreneur, and conspiracy theorist. He is building products called RateCreator & VibeCreation for Creator Economy and Naviya & Ship for AI Native solutions.`;
  const keywords =
    post?.metadataKeywords ||
    "Shaswat Deep, builder, entrepreneur, conspiracy theorist";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Shaswat Deep", url: "https://deepshaswat.com" }],
    creator: "Shaswat Deep",
    publisher: "Shaswat Deep",

    metadataBase: new URL("https://deepshaswat.com"),
    alternates: {
      canonical: post?.metadataCanonicalUrl ?? `/${params.postUrl}`,
    },
    openGraph: {
      title: post?.metadataOgTitle || title,
      description: post?.metadataOgDescription || description,
      siteName: "Shaswat Deep",
      url: `https://deepshaswat.com/${params.postUrl}`,
      locale: "en_US",
      type: "website",
      images: [
        {
          url:
            post?.metadataOgImage ||
            post?.metadataImageUrl ||
            post?.featureImage ||
            "https://deepshaswat.com/static/images/headShot.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post?.metadataTwitterTitle || title,
      description: post?.metadataTwitterDescription || description,
      images: [
        post?.metadataTwitterImage ||
          post?.metadataImageUrl ||
          post?.featureImage ||
          "https://deepshaswat.com/static/images/headShot.png",
      ],
    },
  };
}

export default function EditorPage({
  params,
}: {
  params: { postUrl: string };
}): JSX.Element {
  return <BlogContent params={{ postUrl: params.postUrl }} />;
}
