import { combinedDateTimeSchema, timeSchema } from "@repo/schema";

async function dateTimeValidation(
  datePickerValue: Date,
  timePickerValue: string,
) {
  const validationTime = timeSchema.safeParse(timePickerValue);

  if (!validationTime.success) {
    return {
      error: `Must be in Format: "17:00" !`,
    };
  }

  const validationResult = combinedDateTimeSchema.safeParse({
    date: datePickerValue,
    time: timePickerValue,
  });

  if (!validationResult.success) {
    return {
      error: "Selected date and time cannot be in the past.",
    };
  }
  const [hours, minutes] = timePickerValue.split(":").map(Number);

  // Update the Date object with the provided time
  const combinedDateTime = new Date(datePickerValue);
  combinedDateTime.setHours(hours);
  combinedDateTime.setMinutes(minutes);
  combinedDateTime.setSeconds(0);
  combinedDateTime.setMilliseconds(0);

  return {
    combinedDate: combinedDateTime,
  };
}

async function timeValidation(timePicker: String) {
  const validationResult = timeSchema.safeParse(timePicker);

  if (!validationResult.success) {
    return {
      error: `Must be in Format: "17:00" !`,
    };
  }
  return {
    error: null,
  };
}

export { dateTimeValidation, timeValidation };
