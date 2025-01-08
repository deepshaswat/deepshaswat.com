import { revalidatePath } from "next/cache";

// Revalidation time in seconds
// In development, we don't want to cache
export const PAGE_REVALIDATE =
  process.env.NODE_ENV === "development" ? 0 : 31536000; // 1 year in production

export async function revalidateContent(params: {
  path: string;
  type: "article" | "newsletter";
  scheduled?: boolean;
  scheduledDate?: string;
}) {
  const { path, type, scheduled, scheduledDate } = params;

  // For scheduled posts, we don't revalidate immediately
  if (scheduled && scheduledDate) {
    // This will be handled by the scheduled post system
    return {
      scheduled: true,
      scheduledDate,
      path,
      type,
    };
  }

  // Revalidate the specific post page
  revalidatePath(path);

  // Revalidate the list pages
  if (type === "article") {
    revalidatePath("/articles");
  } else if (type === "newsletter") {
    revalidatePath("/newsletter");
  }

  return { revalidated: true };
}
