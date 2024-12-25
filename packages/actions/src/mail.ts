"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@repo/ui";
// import * as dotenv from "dotenv";
// import path from "path";

// // Load environment variables from the root .env file
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(resendApiKey);

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
