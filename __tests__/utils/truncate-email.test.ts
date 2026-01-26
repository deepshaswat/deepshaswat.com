import { describe, it, expect } from "vitest";

// Utility function extracted from import-members-components.tsx
function truncateEmail(email: string): string {
  if (email.length > 20) {
    return `${email.slice(0, 20)}...`;
  }
  return email;
}

describe("truncateEmail", () => {
  describe("emails within limit", () => {
    it("should return email unchanged when exactly 20 characters", () => {
      const email = "12345678901234567890"; // 20 chars
      expect(truncateEmail(email)).toBe("12345678901234567890");
    });

    it("should return email unchanged when shorter than 20 characters", () => {
      const email = "short@email.com"; // 15 chars
      expect(truncateEmail(email)).toBe("short@email.com");
    });

    it("should return empty string unchanged", () => {
      expect(truncateEmail("")).toBe("");
    });

    it("should return single character unchanged", () => {
      expect(truncateEmail("a")).toBe("a");
    });

    it("should return 19 character email unchanged", () => {
      const email = "1234567890123456789"; // 19 chars
      expect(truncateEmail(email)).toBe("1234567890123456789");
    });
  });

  describe("emails exceeding limit", () => {
    it("should truncate email longer than 20 characters", () => {
      const email = "verylongemail@example.com"; // 25 chars
      expect(truncateEmail(email)).toBe("verylongemail@exampl...");
    });

    it("should truncate email at exactly 21 characters", () => {
      const email = "123456789012345678901"; // 21 chars
      expect(truncateEmail(email)).toBe("12345678901234567890...");
    });

    it("should truncate very long email addresses", () => {
      const email = "this.is.a.very.long.email.address@subdomain.example.com";
      const result = truncateEmail(email);
      expect(result.length).toBe(23); // 20 + "..."
      expect(result.endsWith("...")).toBe(true);
    });

    it("should preserve first 20 characters when truncating", () => {
      const email = "abcdefghij1234567890extra";
      expect(truncateEmail(email)).toBe("abcdefghij1234567890...");
    });
  });

  describe("real-world email addresses", () => {
    const testCases = [
      { email: "john@example.com", expected: "john@example.com", truncated: false },
      { email: "jane.doe@company.org", expected: "jane.doe@company.org", truncated: false },
      {
        email: "user.name@subdomain.example.com",
        expected: "user.name@subdomain....",
        truncated: true,
      },
      {
        email: "firstname.lastname@organization.co.uk",
        expected: "firstname.lastname@o...",
        truncated: true,
      },
      { email: "a@b.com", expected: "a@b.com", truncated: false },
      {
        email: "support+newsletter@example.com",
        expected: "support+newsletter@e...",
        truncated: true,
      },
    ];

    testCases.forEach(({ email, expected, truncated }) => {
      it(`should ${truncated ? "truncate" : "keep"} "${email}"`, () => {
        expect(truncateEmail(email)).toBe(expected);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle email with unicode characters", () => {
      const email = "üser@example.com";
      // 16 characters, should not be truncated
      expect(truncateEmail(email)).toBe("üser@example.com");
    });

    it("should handle email with spaces (invalid but possible)", () => {
      const email = "user with spaces@example.com";
      expect(truncateEmail(email)).toBe("user with spaces@exa...");
    });

    it("should handle email with only special characters", () => {
      const email = "!#$%&'*+-/=?^_`{|}~@example.com";
      const result = truncateEmail(email);
      expect(result.length).toBe(23);
      expect(result.endsWith("...")).toBe(true);
    });
  });
});
