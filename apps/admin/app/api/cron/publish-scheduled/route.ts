import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

// Logging helper for cron job - intentionally using console for server-side logging
const cronLog = (message: string): void => {
  // eslint-disable-next-line no-console -- Cron jobs need server-side logging
  console.log(`[CRON:PUBLISH] ${message}`);
};

const cronError = (message: string, err?: unknown): void => {
  // eslint-disable-next-line no-console -- Cron jobs need server-side logging
  console.error(`[CRON:PUBLISH:ERROR] ${message}`, err ?? "");
};

export async function GET(_request: Request): Promise<NextResponse> {
  try {
    cronLog("Starting scheduled post publishing check...");

    // Get current time in UTC
    const now = new Date();
    const utcNow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
      ),
    );

    cronLog(`Current UTC time: ${utcNow.toISOString()}`);
    cronLog(`Current Local time: ${now.toString()}`);

    // Find all scheduled posts where publishDate is in the past
    const postsToPublish = await prisma.post.findMany({
      where: {
        status: "SCHEDULED",
        publishDate: {
          lte: utcNow,
        },
      },
      select: {
        id: true,
        title: true,
        publishDate: true,
      },
    });

    cronLog(
      `Found ${postsToPublish.length} posts to publish: ${JSON.stringify(postsToPublish, null, 2)}`,
    );

    if (postsToPublish.length > 0) {
      // Log each post's publish date comparison
      postsToPublish.forEach((post) => {
        if (post.publishDate) {
          cronLog(`Post "${post.title}":
            Publish Date (UTC): ${post.publishDate.toISOString()}
            Current Time (UTC): ${utcNow.toISOString()}
            Should Publish: ${post.publishDate <= utcNow}`);
        }
      });

      const updateResult = await prisma.post.updateMany({
        where: {
          id: {
            in: postsToPublish.map((post) => post.id),
          },
          status: "SCHEDULED",
        },
        data: {
          status: "PUBLISHED",
        },
      });

      cronLog(`Successfully published ${updateResult.count} scheduled posts`);
      return NextResponse.json({
        success: true,
        message: `Published ${updateResult.count} posts`,
        posts: postsToPublish,
      });
    }
    cronLog("No scheduled posts found to publish");
    return NextResponse.json({
      success: false,
      message: `No posts to publish`,
    });
  } catch (err) {
    cronError("Failed to publish scheduled posts", err);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 },
    );
  }
}
