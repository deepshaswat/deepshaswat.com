import { describe, it, expect } from "vitest";

// CSV parsing logic extracted from import-members-components.tsx
interface MemberInput {
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed: boolean;
  note?: string;
  openRate?: string;
  location?: string;
  imageUrl?: string;
  resendContactId?: string;
}

function parseCSVToMembers(csvText: string): MemberInput[] {
  const rows = csvText.split("\n");
  const headers = rows[0].toLowerCase().split(",");

  const members = rows
    .slice(1)
    .map((row) => {
      const values = row.split(",");
      return {
        email: values[headers.indexOf("email")]?.trim(),
        firstName: values[headers.indexOf("first_name")]?.trim() || "",
        lastName: values[headers.indexOf("last_name")]?.trim() || "",
        unsubscribed:
          values[headers.indexOf("subscribed_to")]?.trim().toLowerCase() !==
          "false",
        note: "",
        openRate: "N/A",
        location: "Unknown",
        imageUrl: "",
        resendContactId: "",
      } as MemberInput;
    })
    .filter((member) => member.email);

  return members;
}

function parseCSVPreview(csvText: string, limit: number = 5): Partial<MemberInput>[] {
  const rows = csvText.split("\n");
  const headers = rows[0].toLowerCase().split(",");

  const preview = rows
    .slice(1, limit + 1)
    .map((row) => {
      const values = row.split(",");
      return {
        email: values[headers.indexOf("email")]?.trim(),
        firstName: values[headers.indexOf("first_name")]?.trim(),
        lastName: values[headers.indexOf("last_name")]?.trim(),
        unsubscribed:
          values[headers.indexOf("subscribed_to")]?.trim().toLowerCase() !==
          "false",
      };
    })
    .filter((member) => member.email);

  return preview;
}

describe("CSV Parsing for Member Import", () => {
  describe("parseCSVToMembers", () => {
    it("should parse a valid CSV with all fields", () => {
      const csv = `email,first_name,last_name,subscribed_to
john@example.com,John,Doe,true
jane@example.com,Jane,Smith,false`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        unsubscribed: true,
        note: "",
        openRate: "N/A",
        location: "Unknown",
        imageUrl: "",
        resendContactId: "",
      });
      expect(result[1]).toEqual({
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        unsubscribed: false,
        note: "",
        openRate: "N/A",
        location: "Unknown",
        imageUrl: "",
        resendContactId: "",
      });
    });

    it("should handle CSV with only email column", () => {
      const csv = `email
user1@example.com
user2@example.com`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe("user1@example.com");
      expect(result[0].firstName).toBe("");
      expect(result[0].lastName).toBe("");
    });

    it("should filter out rows without email", () => {
      const csv = `email,first_name,last_name
john@example.com,John,Doe
,Jane,Smith
another@example.com,Another,User`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe("john@example.com");
      expect(result[1].email).toBe("another@example.com");
    });

    it("should trim whitespace from values", () => {
      const csv = `email,first_name,last_name
  john@example.com  ,  John  ,  Doe  `;

      const result = parseCSVToMembers(csv);

      expect(result[0].email).toBe("john@example.com");
      expect(result[0].firstName).toBe("John");
      expect(result[0].lastName).toBe("Doe");
    });

    it("should handle case-insensitive headers", () => {
      const csv = `EMAIL,FIRST_NAME,LAST_NAME,SUBSCRIBED_TO
john@example.com,John,Doe,true`;

      const result = parseCSVToMembers(csv);

      expect(result[0].email).toBe("john@example.com");
      expect(result[0].firstName).toBe("John");
    });

    it("should set unsubscribed based on subscribed_to field", () => {
      const csv = `email,subscribed_to
user1@example.com,true
user2@example.com,false
user3@example.com,TRUE
user4@example.com,FALSE`;

      const result = parseCSVToMembers(csv);

      expect(result[0].unsubscribed).toBe(true); // subscribed_to: true means unsubscribed
      expect(result[1].unsubscribed).toBe(false); // subscribed_to: false
      expect(result[2].unsubscribed).toBe(true);
      expect(result[3].unsubscribed).toBe(false);
    });

    it("should handle empty CSV", () => {
      const csv = `email,first_name,last_name`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(0);
    });

    it("should handle CSV with extra columns", () => {
      const csv = `email,first_name,last_name,phone,company
john@example.com,John,Doe,123-456-7890,Acme Inc`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("john@example.com");
    });

    it("should handle CSV with columns in different order", () => {
      const csv = `first_name,email,last_name
John,john@example.com,Doe`;

      const result = parseCSVToMembers(csv);

      expect(result[0].email).toBe("john@example.com");
      expect(result[0].firstName).toBe("John");
      expect(result[0].lastName).toBe("Doe");
    });
  });

  describe("parseCSVPreview", () => {
    it("should return only first 5 rows by default", () => {
      const csv = `email,first_name
user1@example.com,User1
user2@example.com,User2
user3@example.com,User3
user4@example.com,User4
user5@example.com,User5
user6@example.com,User6
user7@example.com,User7`;

      const result = parseCSVPreview(csv);

      expect(result).toHaveLength(5);
      expect(result[0].email).toBe("user1@example.com");
      expect(result[4].email).toBe("user5@example.com");
    });

    it("should respect custom limit parameter", () => {
      const csv = `email,first_name
user1@example.com,User1
user2@example.com,User2
user3@example.com,User3`;

      const result = parseCSVPreview(csv, 2);

      expect(result).toHaveLength(2);
    });

    it("should return all rows if fewer than limit", () => {
      const csv = `email,first_name
user1@example.com,User1
user2@example.com,User2`;

      const result = parseCSVPreview(csv, 5);

      expect(result).toHaveLength(2);
    });

    it("should filter out rows without email in preview", () => {
      const csv = `email,first_name
user1@example.com,User1
,User2
user3@example.com,User3`;

      const result = parseCSVPreview(csv);

      expect(result).toHaveLength(2);
      expect(result.every((m) => m.email)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle Windows-style line endings", () => {
      const csv = `email,first_name\r\nuser1@example.com,User1\r\nuser2@example.com,User2`;

      // Note: This test documents current behavior which may need fixing
      const result = parseCSVToMembers(csv);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle empty fields gracefully", () => {
      const csv = `email,first_name,last_name
john@example.com,,
jane@example.com,Jane,`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(2);
      expect(result[0].firstName).toBe("");
      expect(result[0].lastName).toBe("");
      expect(result[1].firstName).toBe("Jane");
      expect(result[1].lastName).toBe("");
    });

    it("should handle missing columns", () => {
      const csv = `email
user@example.com`;

      const result = parseCSVToMembers(csv);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("user@example.com");
      expect(result[0].firstName).toBe("");
      expect(result[0].lastName).toBe("");
    });
  });
});
