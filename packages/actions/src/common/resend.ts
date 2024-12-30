"use server";

import { Resend } from "resend";
import { EmailTemplate, NewsletterTemplate } from "@repo/ui";
import { PostListType } from "./types";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(resendApiKey);
const audienceId = "83dee91f-fdd3-4cbe-8ed2-11f597f1ad0f";

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
// export const sendNewsletter = async ({
//   post,
//   sendData,
//   markdown,
// }: SendNewsletterProps) => {
//   let sendDate;
//   const audienceId = "fbfc9b75-babe-43df-92cc-40c2c0095d42";
//   if (sendData.status === "PUBLISHED") {
//     sendDate = new Date(Date.now() + 100 * 60).toISOString();
//   } else {
//     sendDate = new Date(sendData.publishDate).toISOString();
//   }

//   try {
//     // Fetch the contacts from the audience list
//     const { data: contacts, error: contactsError } = await resend.contacts.list(
//       {
//         audienceId,
//       }
//     );

//     if (contactsError) {
//       console.error("Error fetching contacts:", contactsError);
//       return {
//         error: "Failed to fetch audience contacts",
//       };
//     }

//     // Filter contacts to exclude unsubscribed users
//     const validContacts = contacts?.data.filter(
//       (contact) => !contact.unsubscribed
//     );

//     // Send emails to each contact in the filtered list
//     const results = [];
//     for (const contact of validContacts ?? []) {
//       try {
//         const { data, error } = await resend.emails.send({
//           from: "Shaswat Deep <contact@mail.deepshaswat.com>",
//           to: contact.email,
//           replyTo: "hi@deepshaswat.com",
//           subject: post.title,
//           react: NewsletterTemplate({ post, markdown }),
//           headers: {
//             "List-Unsubscribe": "<https://deepshaswat.com/unsubscribe>",
//           },
//           scheduledAt: sendDate,
//         });

//         if (error) {
//           console.error(`Error sending email to ${contact.email}:`, error);
//           results.push({ email: contact.email, success: false, error });
//         } else {
//           results.push({ email: contact.email, success: true, data });
//         }
//       } catch (emailError) {
//         console.error(`Error sending email to ${contact.email}:`, emailError);
//         results.push({
//           email: contact.email,
//           success: false,
//           error: emailError,
//         });
//       }
//     }

//     return {
//       success: results.every((result) => result.success),
//       results,
//     };
//   } catch (error) {
//     console.error("Error sending newsletter:", error);
//     return {
//       error: "Failed to send newsletter",
//     };
//   }
// };

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
