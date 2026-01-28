"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@repo/ui";
import { useRouter } from "next/navigation";
import type { PostListType } from "@repo/actions";

interface RecentPostsProps {
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

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "scheduled":
      return "outline";
    default:
      return "secondary";
  }
}

export function RecentPosts({ posts }: RecentPostsProps): JSX.Element {
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
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
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
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {capitalizeFirstLetter(post.title)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {post.isNewsletter ? (
                    <Badge className="text-xs" variant="outline">
                      Newsletter
                    </Badge>
                  ) : null}
                  <Badge variant={getStatusBadgeVariant(post.status)}>
                    {capitalizeFirstLetter(post.status)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
