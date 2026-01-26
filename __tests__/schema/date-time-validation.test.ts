import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { z } from "zod";

// Recreating the schemas since we can't import directly from @repo/schema in tests
const timeSchema = z.string().refine(
  (value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(value);
  },
  {
    message: "Invalid time format. Please use 24-hour format (HH:MM).",
  }
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
    }
  );

describe("timeSchema", () => {
  describe("valid times", () => {
    it("should accept valid 24-hour format times", () => {
      const validTimes = [
        "00:00",
        "01:30",
        "12:00",
        "13:45",
        "23:59",
        "09:05",
        "10:10",
        "15:30",
        "20:00",
        "21:45",
      ];

      validTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(true);
      });
    });

    it("should accept midnight (00:00)", () => {
      const result = timeSchema.safeParse("00:00");
      expect(result.success).toBe(true);
    });

    it("should accept end of day (23:59)", () => {
      const result = timeSchema.safeParse("23:59");
      expect(result.success).toBe(true);
    });

    it("should accept times with leading zeros", () => {
      const result = timeSchema.safeParse("09:05");
      expect(result.success).toBe(true);
    });
  });

  describe("invalid times", () => {
    it("should reject invalid hour values", () => {
      const invalidTimes = ["24:00", "25:30", "30:00", "-1:00"];

      invalidTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(false);
      });
    });

    it("should reject invalid minute values", () => {
      const invalidTimes = ["12:60", "12:99", "12:-5"];

      invalidTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(false);
      });
    });

    it("should reject 12-hour format with AM/PM", () => {
      const invalidTimes = ["12:00 PM", "1:30 AM", "11:00AM"];

      invalidTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(false);
      });
    });

    it("should reject incorrect separators", () => {
      const invalidTimes = ["12.00", "12-00", "12 00", "12/00"];

      invalidTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(false);
      });
    });

    it("should reject times without leading zeros", () => {
      const invalidTimes = ["9:05", "1:30", "9:5"];

      invalidTimes.forEach((time) => {
        const result = timeSchema.safeParse(time);
        expect(result.success).toBe(false);
      });
    });

    it("should reject empty string", () => {
      const result = timeSchema.safeParse("");
      expect(result.success).toBe(false);
    });

    it("should reject non-time strings", () => {
      const invalidInputs = ["not a time", "hello", "12345"];

      invalidInputs.forEach((input) => {
        const result = timeSchema.safeParse(input);
        expect(result.success).toBe(false);
      });
    });

    it("should return correct error message for invalid format", () => {
      const result = timeSchema.safeParse("invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Invalid time format. Please use 24-hour format (HH:MM)."
        );
      }
    });
  });
});

describe("combinedDateTimeSchema", () => {
  beforeEach(() => {
    // Mock current time to a fixed date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("valid inputs", () => {
    it("should accept future date and time", () => {
      const futureDate = new Date("2024-06-16");
      const validData = {
        date: futureDate,
        time: "14:00",
      };

      const result = combinedDateTimeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept current date with future time", () => {
      const today = new Date("2024-06-15");
      const validData = {
        date: today,
        time: "13:00", // 1 hour after mocked current time
      };

      const result = combinedDateTimeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept date far in the future", () => {
      const futureDate = new Date("2025-12-31");
      const validData = {
        date: futureDate,
        time: "00:00",
      };

      const result = combinedDateTimeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("should reject past date", () => {
      const pastDate = new Date("2024-06-10");
      const invalidData = {
        date: pastDate,
        time: "14:00",
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject current date with past time", () => {
      const today = new Date("2024-06-15");
      const invalidData = {
        date: today,
        time: "10:00", // 2 hours before mocked current time
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid time format", () => {
      const futureDate = new Date("2024-06-16");
      const invalidData = {
        date: futureDate,
        time: "25:00",
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing date", () => {
      const invalidData = {
        time: "14:00",
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing time", () => {
      const futureDate = new Date("2024-06-16");
      const invalidData = {
        date: futureDate,
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should return correct error message for past date/time", () => {
      const pastDate = new Date("2024-06-01");
      const invalidData = {
        date: pastDate,
        time: "10:00",
      };

      const result = combinedDateTimeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.issues.find(
          (i) => i.message === "Selected date and time cannot be in the past."
        );
        expect(errorMessage).toBeDefined();
      }
    });
  });
});
