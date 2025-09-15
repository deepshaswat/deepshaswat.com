import { BlogContent } from "@repo/ui/web";
import { Metadata } from "next";
import { fetchPostByPostUrl } from "@repo/actions";

export const revalidate = 31536000;

export async function generateMetadata({
  params,
}: {
  params: { postUrl: string };
}): Promise<Metadata> {
  // Fetch post data server-side
  const post = await fetchPostByPostUrl(params.postUrl);

  const title = `${post?.title + " // Shaswat Deep"}`;
  const description =
    post?.metadataDescription ||
    `Shaswat Deep is a software engineer, entrepreneur, and writer.`;
  const keywords =
    post?.metadataKeywords ||
    "Shaswat Deep, software engineer, entrepreneur, writer";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Shaswat Deep", url: "https://deepshaswat.com" }],
    creator: "Shaswat Deep",
    publisher: "Shaswat Deep",

    metadataBase: new URL("https://deepshaswat.com"),
    alternates: {
      canonical: `/${params.postUrl}` || post?.metadataCanonicalUrl,
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
          width:
            post?.metadataOgImage ||
            post?.metadataImageUrl ||
            post?.featureImage
              ? 1200
              : 800,
          height:
            post?.metadataOgImage ||
            post?.metadataImageUrl ||
            post?.featureImage
              ? 630
              : 800,
          alt: `${post?.title} // Shaswat Deep`,
          type: "image/png",
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
}) {
  return <BlogContent params={{ postUrl: params.postUrl }} />;
}
