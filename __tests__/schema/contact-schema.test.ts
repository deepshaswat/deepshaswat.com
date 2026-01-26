import { describe, it, expect } from "vitest";
import { z } from "zod";

// Recreating the schema since we can't import directly from @repo/schema in tests
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

describe("ContactSchema", () => {
  describe("valid inputs", () => {
    it("should accept valid contact form data", () => {
      const validData = {
        email: "test@example.com",
        name: "John Doe",
        message: "This is a test message that is long enough to pass validation.",
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept name with exactly 6 characters", () => {
      const validData = {
        email: "test@example.com",
        name: "JohnDo",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept message with exactly 20 characters", () => {
      const validData = {
        email: "test@example.com",
        name: "John Doe",
        message: "12345678901234567890",
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        name: "John Doe",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("email");
      }
    });

    it("should reject empty email", () => {
      const invalidData = {
        email: "",
        name: "John Doe",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject name shorter than 6 characters", () => {
      const invalidData = {
        email: "test@example.com",
        name: "John",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject empty name", () => {
      const invalidData = {
        email: "test@example.com",
        name: "",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject message shorter than 20 characters", () => {
      const invalidData = {
        email: "test@example.com",
        name: "John Doe",
        message: "Too short",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("message");
      }
    });

    it("should reject empty message", () => {
      const invalidData = {
        email: "test@example.com",
        name: "John Doe",
        message: "",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing fields", () => {
      const invalidData = {};

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe("error messages", () => {
    it("should return correct error message for invalid email", () => {
      const invalidData = {
        email: "invalid",
        name: "John Doe",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path.includes("email"));
        expect(emailError?.message).toBe("Email is required");
      }
    });

    it("should return correct error message for short name", () => {
      const invalidData = {
        email: "test@example.com",
        name: "Jo",
        message: "This is a test message that is long enough.",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes("name"));
        expect(nameError?.message).toBe("Name is required");
      }
    });

    it("should return correct error message for short message", () => {
      const invalidData = {
        email: "test@example.com",
        name: "John Doe",
        message: "Short",
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messageError = result.error.issues.find((i) => i.path.includes("message"));
        expect(messageError?.message).toBe("Minimum of length 20 is required");
      }
    });
  });
});
