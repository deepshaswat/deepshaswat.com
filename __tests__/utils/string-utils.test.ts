import { describe, it, expect } from "vitest";

/**
 * Utility functions extracted from member-component.tsx for testing.
 * In a real-world scenario, these would be in a shared utils package.
 */

/**
 * Capitalizes the first letter of each word in a string.
 */
function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Generates initials from a name string.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

describe("capitalizeWords", () => {
  it("should capitalize the first letter of each word", () => {
    expect(capitalizeWords("hello world")).toBe("Hello World");
  });

  it("should handle single word input", () => {
    expect(capitalizeWords("hello")).toBe("Hello");
  });

  it("should handle already capitalized words", () => {
    expect(capitalizeWords("HELLO WORLD")).toBe("Hello World");
  });

  it("should handle mixed case input", () => {
    expect(capitalizeWords("hElLo WoRlD")).toBe("Hello World");
  });

  it("should handle empty string", () => {
    expect(capitalizeWords("")).toBe("");
  });

  it("should handle multiple spaces between words", () => {
    // Note: Current implementation preserves empty strings from split
    expect(capitalizeWords("hello  world")).toBe("Hello  World");
  });

  it("should handle names with multiple parts", () => {
    expect(capitalizeWords("john doe smith")).toBe("John Doe Smith");
  });

  it("should handle single character words", () => {
    expect(capitalizeWords("a b c")).toBe("A B C");
  });
});

describe("getInitials", () => {
  it("should return initials from a full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("should handle single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("should handle multiple names", () => {
    expect(getInitials("John Michael Doe")).toBe("JMD");
  });

  it("should convert lowercase to uppercase", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("should handle empty string", () => {
    expect(getInitials("")).toBe("");
  });

  it("should handle names with extra spaces", () => {
    // Note: Current implementation includes empty strings
    expect(getInitials("John  Doe")).toBe("JD");
  });

  it("should handle single character names", () => {
    expect(getInitials("A B C")).toBe("ABC");
  });

  it("should handle mixed case names", () => {
    expect(getInitials("jOHN dOE")).toBe("JD");
  });
});
