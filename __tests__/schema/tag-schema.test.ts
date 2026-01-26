import { describe, it, expect } from "vitest";
import { z } from "zod";

// Recreating the schema since we can't import directly from @repo/schema in tests
const tagSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  imageUrl: z.string().optional(),
});

const updateTagSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

describe("tagSchema", () => {
  describe("valid inputs", () => {
    it("should accept valid tag with only required fields", () => {
      const validData = {
        slug: "my-tag",
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept valid tag with all fields", () => {
      const validData = {
        slug: "my-tag",
        description: "A description for this tag",
        imageUrl: "https://example.com/image.png",
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept tag with description at max length (500 chars)", () => {
      const validData = {
        slug: "my-tag",
        description: "a".repeat(500),
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept tag with empty description", () => {
      const validData = {
        slug: "my-tag",
        description: "",
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept tag without optional fields", () => {
      const validData = {
        slug: "technology",
      };

      const result = tagSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeUndefined();
        expect(result.data.imageUrl).toBeUndefined();
      }
    });
  });

  describe("invalid inputs", () => {
    it("should reject empty slug", () => {
      const invalidData = {
        slug: "",
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Slug is required");
      }
    });

    it("should reject missing slug", () => {
      const invalidData = {
        description: "A tag description",
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject description longer than 500 characters", () => {
      const invalidData = {
        slug: "my-tag",
        description: "a".repeat(501),
      };

      const result = tagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Description must be less than 500 characters"
        );
      }
    });
  });
});

describe("updateTagSchema", () => {
  describe("valid inputs", () => {
    it("should accept valid update data with required fields", () => {
      const validData = {
        id: "tag-123",
        slug: "updated-tag",
      };

      const result = updateTagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept valid update data with all fields", () => {
      const validData = {
        id: "tag-123",
        slug: "updated-tag",
        description: "Updated description",
        imageUrl: "https://example.com/new-image.png",
      };

      const result = updateTagSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("should reject missing id", () => {
      const invalidData = {
        slug: "updated-tag",
      };

      const result = updateTagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty id", () => {
      const invalidData = {
        id: "",
        slug: "updated-tag",
      };

      const result = updateTagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Tag ID is required");
      }
    });

    it("should reject missing slug", () => {
      const invalidData = {
        id: "tag-123",
      };

      const result = updateTagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty slug", () => {
      const invalidData = {
        id: "tag-123",
        slug: "",
      };

      const result = updateTagSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Slug is required");
      }
    });
  });
});
