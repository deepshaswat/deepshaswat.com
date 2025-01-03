import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
  try {
    // Find all scheduled posts where publishDate is in the past

    const postsToPublish = await prisma.post.updateMany({
      where: {
        status: "SCHEDULED",
        publishDate: {
          lte: new Date(),
        },
      },
      data: {
        status: "PUBLISHED",
      },
    });

    if (postsToPublish.count > 0) {
      return NextResponse.json({
        success: true,
        message: `Published ${postsToPublish.count} posts`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `No posts to publish`,
      });
    }
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
