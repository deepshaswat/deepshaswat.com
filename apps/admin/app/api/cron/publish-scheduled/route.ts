// Mark this route as dynamic
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

const log = (message: string) => {
  console.log(`[CRON:PUBLISH] ${message}`);
};

const error = (message: string, err?: any) => {
  console.error(`[CRON:PUBLISH:ERROR] ${message}`, err || "");
};

export async function GET(request: Request) {
  try {
    log("Starting scheduled post publishing check...");

    // Verify the request is from Vercel Cron
    const isVercelCron = request.headers.get("x-vercel-cron");
    if (!isVercelCron && process.env.VERCEL_ENV === "production") {
      error("Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get current time in UTC
    const now = new Date();
    const utcNow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    log(`Current UTC time: ${utcNow.toISOString()}`);
    log(`Current Local time: ${now.toString()}`);

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

    log(
      `Found ${postsToPublish.length} posts to publish: ${JSON.stringify(postsToPublish, null, 2)}`
    );

    if (postsToPublish.length > 0) {
      // Log each post's publish date comparison
      postsToPublish.forEach((post) => {
        if (post.publishDate) {
          log(`Post "${post.title}":
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

      log(`Successfully published ${updateResult.count} scheduled posts`);
      return NextResponse.json({
        success: true,
        message: `Published ${updateResult.count} posts`,
        posts: postsToPublish,
      });
    } else {
      log("No scheduled posts found to publish");
      return NextResponse.json({
        success: false,
        message: `No posts to publish`,
      });
    }
  } catch (err) {
    error("Failed to publish scheduled posts", err);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
