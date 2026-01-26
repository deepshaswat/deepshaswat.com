import { describe, it, expect } from "vitest";

// Utility functions extracted from admin components
function reverseAndHyphenate(item: string): string {
  return item.toLowerCase().split(" ").join("-");
}

function capitalizeFirstLetter(item: string): string {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
}

describe("Admin String Helpers", () => {
  describe("reverseAndHyphenate", () => {
    it("should convert single word to lowercase", () => {
      expect(reverseAndHyphenate("Hello")).toBe("hello");
    });

    it("should convert multiple words to hyphenated lowercase", () => {
      expect(reverseAndHyphenate("Hello World")).toBe("hello-world");
    });

    it("should handle already lowercase words", () => {
      expect(reverseAndHyphenate("hello world")).toBe("hello-world");
    });

    it("should handle mixed case words", () => {
      expect(reverseAndHyphenate("HeLLo WoRLD")).toBe("hello-world");
    });

    it("should handle single character", () => {
      expect(reverseAndHyphenate("A")).toBe("a");
    });

    it("should handle empty string", () => {
      expect(reverseAndHyphenate("")).toBe("");
    });

    it("should handle multiple spaces", () => {
      expect(reverseAndHyphenate("hello  world")).toBe("hello--world");
    });

    it("should create valid URL slugs", () => {
      expect(reverseAndHyphenate("Web Development")).toBe("web-development");
      expect(reverseAndHyphenate("JavaScript Tutorial")).toBe(
        "javascript-tutorial",
      );
      expect(reverseAndHyphenate("React Hooks Guide")).toBe(
        "react-hooks-guide",
      );
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize first word only", () => {
      expect(capitalizeFirstLetter("hello-world")).toBe("Hello world");
    });

    it("should handle single word", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
    });

    it("should handle already capitalized words", () => {
      // Note: function only lowercases subsequent words, not the first word's remaining chars
      expect(capitalizeFirstLetter("HELLO-WORLD")).toBe("HELLO world");
    });

    it("should handle mixed case", () => {
      // Note: function only lowercases subsequent words, not the first word's remaining chars
      expect(capitalizeFirstLetter("hELLO-wORLD")).toBe("HELLO world");
    });

    it("should handle multiple hyphenated words", () => {
      expect(capitalizeFirstLetter("web-development-tips")).toBe(
        "Web development tips",
      );
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    it("should handle single character", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
    });

    it("should convert URL slugs to readable text", () => {
      expect(capitalizeFirstLetter("javascript-tutorial")).toBe(
        "Javascript tutorial",
      );
      expect(capitalizeFirstLetter("react-hooks-guide")).toBe(
        "React hooks guide",
      );
    });
  });

  describe("round-trip conversion", () => {
    it("should convert display name to slug and back", () => {
      const displayName = "Web Development";
      const slug = reverseAndHyphenate(displayName);
      const backToDisplay = capitalizeFirstLetter(slug);

      expect(slug).toBe("web-development");
      expect(backToDisplay).toBe("Web development");
    });

    it("should handle multi-word conversion", () => {
      const displayName = "React Hooks Tutorial";
      const slug = reverseAndHyphenate(displayName);
      const backToDisplay = capitalizeFirstLetter(slug);

      expect(slug).toBe("react-hooks-tutorial");
      expect(backToDisplay).toBe("React hooks tutorial");
    });
  });
});
