import * as z from "zod";

const ContactSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  name: z.string().min(6, {
    message: "Name is required",
  }),
  message: z.string().min(20, {
    message: "Minimum of length 20 is required",
  }),
});

const timeSchema = z.string().refine(
  (value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(value);
  },
  {
    message: "Invalid time format. Please use 24-hour format (HH:MM).",
  },
);

const combinedDateTimeSchema = z
  .object({
    date: z.date(),
    time: timeSchema,
  })
  .refine(
    ({ date, time }) => {
      const [hours, minutes] = time.split(":").map(Number);

      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(hours);
      combinedDateTime.setMinutes(minutes);
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);

      return combinedDateTime >= new Date();
    },
    {
      message: "Selected date and time cannot be in the past.",
    },
  );

export { ContactSchema, timeSchema, combinedDateTimeSchema };