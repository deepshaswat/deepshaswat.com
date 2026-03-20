"use server";

import { Resend } from "resend";
import { EmailTemplate, NewsletterTemplate } from "@repo/ui";
import { PostListType } from "./types";
import { createEmailSendRecord } from "../admin/email-analytics";
import {
  EMAIL_FROM,
  EMAIL_REPLY_TO,
  APP_URL,
  UNSUBSCRIBE_URL,
} from "./email-config";
import { generateUnsubscribeToken } from "./unsubscribe-tokens";
import prisma from "@repo/db/client";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(resendApiKey);
const audience = process.env.RESEND_AUDIENCE_ID;

if (!audience) {
  throw new Error("RESEND_AUDIENCE_ID is not defined in environment variables");
}

const audienceId = audience;

export const sendEmail = async (
  name: string,
  email: string,
  message: string,
) => {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_REPLY_TO,
    subject: "Email from: " + name,
    replyTo: email,
    react: EmailTemplate({ name, email, message }),
  });

  if (error) {
    console.log(error);
    return {
      error: "Something went wrong!",
    };
  }

  return {
    success: "Message sent!",
    data: data,
  };
};

interface SendNewsletterProps {
  post: PostListType;
  sendData: any;
  markdown: string;
}

export const sendBroadcastNewsletter = async ({
  post,
  sendData,
  markdown,
}: SendNewsletterProps) => {
  let sendDate;
  if (sendData.status === "PUBLISHED") {
    sendDate = new Date(Date.now() + 100 * 60).toISOString();
  } else {
    sendDate = new Date(sendData.publishDate).toISOString();
  }

  try {
    // Get actual subscriber count from database
    let recipientCount = 0;
    try {
      recipientCount = await prisma.member.count({
        where: { unsubscribed: false },
      });
    } catch (e) {
      console.warn("Could not fetch subscriber count:", e);
    }

    // Fetch the contacts from the audience list
    const { data: broadcastData, error: broadcastError } =
      await resend.broadcasts.create({
        from: EMAIL_FROM,
        audienceId,
        replyTo: EMAIL_REPLY_TO,
        subject: post.title,
        react: NewsletterTemplate({ post, markdown }),
        name: "Newsletter: " + post.title,
      });

    if (broadcastError) {
      console.error("Error creating broadcast:", broadcastError);
      return {
        error: "Failed to create broadcast",
      };
    }

    const { data: broadcastSendData, error: broadcastSendError } =
      await resend.broadcasts.send(broadcastData?.id || "", {
        scheduledAt: sendDate,
      });

    if (broadcastSendError) {
      console.error("Error sending broadcast:", broadcastSendError);
      return {
        error: "Failed to send broadcast",
      };
    }

    // Record the email send in database for analytics tracking
    if (broadcastData?.id) {
      try {
        await createEmailSendRecord(
          broadcastData.id, // Use broadcast ID as resendEmailId
          broadcastData.id,
          post.id || null,
          post.title,
          EMAIL_FROM,
          recipientCount,
        );
      } catch (e) {
        // Don't fail the send if analytics tracking fails
        console.error("Failed to create email send record:", e);
      }
    }

    return {
      success: true,
      data: broadcastSendData,
    };
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return {
      error: "Failed to send newsletter",
    };
  }
};

interface SendNewsletterToIndividualsProps {
  post: PostListType;
  emails: string[];
  emailHtml: string;
}

export const sendNewsletterToIndividuals = async ({
  post,
  emails,
  emailHtml,
}: SendNewsletterToIndividualsProps) => {
  const chunkSize = 100;
  let sent = 0;
  let failed = 0;

  try {
    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);

      const batchEmails = chunk.map((email) => {
        const token = generateUnsubscribeToken(email);
        const unsubscribeUrl = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(email)}&token=${token}`;

        return {
          from: EMAIL_FROM,
          replyTo: EMAIL_REPLY_TO,
          to: [email],
          subject: post.title,
          html: wrapEmailHtml(post, emailHtml, unsubscribeUrl),
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        };
      });

      try {
        const { data, error } = await resend.batch.send(batchEmails);
        if (error) {
          console.error("[Email] Batch send error:", error);
          failed += chunk.length;
        } else {
          sent += data?.data?.length ?? chunk.length;
        }
      } catch (err) {
        console.error("[Email] Batch send exception:", err);
        failed += chunk.length;
      }

      // Rate limit: wait 500ms between batches
      if (i + chunkSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Record the email send in database for analytics
    try {
      await createEmailSendRecord(
        `individual-${Date.now()}`,
        null,
        post.id || null,
        post.title,
        EMAIL_FROM,
        sent,
      );
    } catch (e) {
      console.error("Failed to create email send record:", e);
    }

    console.log(
      `[Email] Individual send complete: ${sent} delivered, ${failed} failed`,
    );

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Error sending individual newsletter:", error);
    return { error: "Failed to send newsletter to individuals" };
  }
};

function wrapEmailHtml(
  post: PostListType,
  contentHtml: string,
  unsubscribeUrl: string,
): string {
  const publishDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return `<!DOCTYPE html>
<html>
<head><title>${post.title}</title></head>
<body style="background-color:#000000;margin:0;padding:20px;font-family:Inter,sans-serif;">
<div style="margin:0 auto;padding:20px;max-width:640px;background-color:#111111;border-radius:8px;">
  ${
    post.featureImage
      ? `<div style="text-align:center;margin-bottom:20px;"><img src="${post.featureImage}" alt="${post.title}" width="600" style="border-radius:8px;max-width:100%;" /></div>`
      : ""
  }
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="font-size:32px;font-weight:bold;margin:0 0 24px;color:#ffffff;line-height:1.2;">${post.title}</h1>
  </div>
  ${
    post.author
      ? `<div style="text-align:center;margin-bottom:20px;">
    <span style="color:#ffffff;font-size:16px;font-weight:500;">${post.author.name}</span>
  </div>`
      : ""
  }
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:14px;color:#a3a3a3;">${publishDate} · <a href="${APP_URL}/${post.postUrl}" style="color:#d4d4d4;text-decoration:underline;">View in browser</a></span>
  </div>
  <div style="padding:0 20px;color:#ffffff;">
    ${contentHtml}
  </div>
  <hr style="margin:40px 0;border-color:#333333;" />
  <div style="text-align:center;color:#a3a3a3;font-size:14px;padding:0 20px;">
    <p style="margin:0 0 12px;">You are receiving this email because you are subscribed to the newsletter.</p>
    <a href="${unsubscribeUrl}" style="color:#9199a1;text-decoration:underline;font-size:12px;">Unsubscribe from emails like this</a>
  </div>
</div>
</body>
</html>`;
}

interface AddContactToAudienceProps {
  email: string;
  firstName: string;
  lastName: string;
  unsubscribed: boolean;
}

export const addContactToAudience = async ({
  email,
  firstName,
  lastName,
  unsubscribed,
}: AddContactToAudienceProps) => {
  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      audienceId,
      unsubscribed,
    });

    if (error) {
      console.log(error);
      return {
        error: "Something went wrong!",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error adding contact to audience:", error);
    return {
      error: "Failed to add contact to audience",
    };
  }
};

export const updateContactAudience = async ({
  id,
  firstName,
  lastName,
  unsubscribed,
}: {
  id: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}) => {
  try {
    await resend.contacts.update({
      id,
      firstName,
      lastName,
      audienceId,
      unsubscribed,
    });
  } catch (error) {
    console.error("Error updating contact audience:", error);
    return {
      error: "Failed to update contact audience",
    };
  }
};

export const deleteContactAudience = async (id: string) => {
  try {
    const { data, error } = await resend.contacts.get({
      id,
      audienceId,
    });
    if (data) {
      await resend.contacts.remove({
        id,
        audienceId,
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting contact audience:", error);
    return {
      error: "Failed to delete contact audience",
    };
  }
};
