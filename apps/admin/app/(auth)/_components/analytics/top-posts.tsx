"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@repo/ui";
import { useRouter } from "next/navigation";
import type { PostListType } from "@repo/actions";

interface TopPostsProps {
  posts: PostListType[];
}

function capitalizeFirstLetter(item: string): string {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
}

export function TopPosts({ posts }: TopPostsProps): JSX.Element {
  const router = useRouter();

  const handlePostClick = (postId: string): void => {
    router.push(`/editor/${postId}`);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    postId: string,
  ): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePostClick(postId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Published Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No published posts yet
            </p>
          ) : (
            posts.map((post, index) => (
              <div
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                key={post.id}
                onClick={() => {
                  handlePostClick(post.id);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e, post.id);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {capitalizeFirstLetter(post.title)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.publishDate
                      ? new Date(post.publishDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Not published"}
                  </p>
                </div>
                {post.isNewsletter ? (
                  <Badge className="text-xs" variant="outline">
                    Newsletter
                  </Badge>
                ) : null}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
