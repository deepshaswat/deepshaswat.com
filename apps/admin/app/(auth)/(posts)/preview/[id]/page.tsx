"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BlockNoteRenderer } from "@repo/ui";
import { fetchPostById } from "@repo/actions";

interface PreviewPost {
  title: string;
  content: string;
  excerpt: string | null;
  featureImage: string | null;
}

export default function PreviewPage(): JSX.Element {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<PreviewPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      try {
        const result = await fetchPostById(postId);
        if (result) {
          setPost({
            title: result.title,
            content: result.content,
            excerpt: result.excerpt,
            featureImage: result.featureImage,
          });
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Failed to load preview
          </h1>
          <p className="text-muted-foreground">{error || "Post not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </span>

        {post.featureImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote S3 feature image; next/image would require domain config
          <img
            alt={post.title}
            className="mt-4 max-h-80 w-full rounded-lg object-cover"
            src={post.featureImage}
          />
        ) : null}

        <h1 className="mb-2 mt-6 text-4xl font-bold text-foreground">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mb-8 text-lg text-muted-foreground">{post.excerpt}</p>
        ) : null}

        <div className="prose prose-invert prose-lg mt-8 max-w-none">
          {post.content ? (
            <BlockNoteRenderer
              className="text-neutral-200"
              content={post.content}
            />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No content to preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
