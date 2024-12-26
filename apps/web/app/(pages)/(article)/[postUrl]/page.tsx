import { BlogContent } from "@repo/ui/web";
import { Metadata } from "next";
import { generateSiteConfig } from "@repo/ui/web";
import { fetchPostByPostUrl } from "@repo/actions";

export async function generateMetadata({
  params,
}: {
  params: { postUrl: string };
}): Promise<Metadata> {
  // Fetch post data server-side
  const post = await fetchPostByPostUrl(params.postUrl);

  // Generate metadata using post data
  return generateSiteConfig(
    `${post?.title + " // Shaswat Deep"}`,
    post?.excerpt ||
      "Shaswat Deep is a software engineer, entrepreneur, and writer.",
    `/${params.postUrl}`,
    post?.featureImage || "/static/images/headShot.svg",
    post
      ? {
          metadataTitle: post.metadataTitle + " // Shaswat Deep" || undefined,
          metadataDescription: post.metadataDescription || undefined,
          metadataImageUrl: post.metadataImageUrl || undefined,
          metadataKeywords: post.metadataKeywords || undefined,
          metadataAuthorName: post.metadataAuthorName || undefined,
          metadataCanonicalUrl: post.metadataCanonicalUrl || undefined,
          metadataOgTitle:
            post.metadataOgTitle + " // Shaswat Deep" || undefined,
          metadataOgDescription: post.metadataOgDescription || undefined,
          metadataOgImage: post.metadataOgImage || undefined,
          metadataTwitterCard: (post.metadataTwitterCard ||
            "summary_large_image") as
            | "summary_large_image"
            | "summary"
            | "player"
            | "app",
          metadataTwitterTitle:
            post.metadataTwitterTitle + " // Shaswat Deep" || undefined,
          metadataTwitterDescription:
            post.metadataTwitterDescription || undefined,
          metadataTwitterImage: post.metadataTwitterImage || undefined,
        }
      : undefined
  );
}

export default function EditorPage({
  params,
}: {
  params: { postUrl: string };
}) {
  return <BlogContent params={{ postUrl: params.postUrl }} />;
}
