"use server";

import * as z from "zod";

import { ContactSchema } from "@repo/schema";
import prisma from "@repo/db/client";
import { sendEmail } from "@repo/actions";

export const contact = async (values: z.infer<typeof ContactSchema>) => {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { email, name, message } = validatedFields.data;

  try {
    console.time("DB Operation");
    await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
      },
    });
    console.timeEnd("DB Operation");
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong!",
    };
  }
  console.time("Email Sending");
  await sendEmail(name, email, message).then((status) => {
    if (status.error) {
      console.error("Email Error:", status.error);
    }
  });
  console.timeEnd("Email Sending");

  return {
    success: "Message sent!",
  };
};
