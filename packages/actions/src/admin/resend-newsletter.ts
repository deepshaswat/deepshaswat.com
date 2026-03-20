"use server";

import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import {
  sendBroadcastNewsletter,
  sendNewsletterToIndividuals,
} from "../common/resend";
import { blocknoteToEmailHtml } from "../common/blocknote-to-email";

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

/**
 * Resend a published newsletter to all subscribers or individual emails.
 * Does NOT change post status or publishDate — purely re-sends the email.
 */
export async function resendNewsletter(
  postId: string,
  individualEmails?: string[],
) {
  await authenticateUser();

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true, author: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (!post.isNewsletter) {
      return { error: "Post is not a newsletter" };
    }

    if (post.status !== "PUBLISHED") {
      return { error: "Can only resend published newsletters" };
    }

    const postData = {
      ...post,
      featureImage: post.featureImage ?? "",
      publishDate: post.publishDate,
      tags: post.tags,
      author: post.author,
    } as unknown as import("../common/types").PostListType;

    if (individualEmails && individualEmails.length > 0) {
      const emailHtml = blocknoteToEmailHtml(post.content);
      const result = await sendNewsletterToIndividuals({
        post: postData,
        emails: individualEmails,
        emailHtml,
      });

      if ("error" in result) {
        return { error: result.error };
      }

      return { success: true, sent: result.sent, failed: result.failed };
    } else {
      // Broadcast to all subscribers
      const sendData = { status: "PUBLISHED" };
      const result = await sendBroadcastNewsletter({
        post: postData,
        sendData,
        markdown: "", // Broadcast uses React template, not markdown
      });

      if ("error" in result) {
        return { error: result.error };
      }

      return { success: true };
    }
  } catch (error) {
    console.error("Error resending newsletter:", error);
    return { error: "Failed to resend newsletter" };
  }
}
