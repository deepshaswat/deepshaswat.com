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
    // console.time("DB Operation");
    await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
      },
    });
    // console.timeEnd("DB Operation");
    const status = await sendEmail(name, email, message);
    if (status.error) {
      console.error("Email Error:", status.error);
    }
    return {
      success: "Message sent!",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong!",
    };
  }
};
