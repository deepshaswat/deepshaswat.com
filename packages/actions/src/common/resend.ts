"use server";

import { Resend } from "resend";
import { EmailTemplate, NewsletterTemplate } from "@repo/ui";
import { PostListType } from "./types";

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
  message: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Shaswat Deep <contact@mail.deepshaswat.com>",
    to: "hi@deepshaswat.com",
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

export const sendNewsletter = async ({
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
    const { data, error } = await resend.emails.send({
      from: "Shaswat Deep <contact@mail.deepshaswat.com>",
      to: "deepshaswat@gmail.com",
      replyTo: "hi@deepshaswat.com",
      subject: post.title,
      react: NewsletterTemplate({ post, markdown }),
      headers: {
        "List-Unsubscribe": "<https://deepshaswat.com/unsubscribe>",
      },
      scheduledAt: sendDate,
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
    console.error("Error sending newsletter:", error);
    return {
      error: "Failed to send newsletter",
    };
  }
};

// TODO: Uncomment this when we have a proper audience list
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
    // Fetch the contacts from the audience list
    const { data: broadcastData, error: broadcastError } =
      await resend.broadcasts.create({
        from: "Shaswat Deep <contact@mail.deepshaswat.com>",
        audienceId,
        replyTo: "hi@deepshaswat.com",
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
