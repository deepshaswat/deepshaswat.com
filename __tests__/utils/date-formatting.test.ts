import { describe, it, expect } from "vitest";

// Function extracted from publish-dialog-component.tsx
function formatDayAndDate(date: Date): string {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  } as const;
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

describe("formatDayAndDate", () => {
  describe("basic formatting", () => {
    it("should format a date correctly", () => {
      const date = new Date("2024-06-15");
      const result = formatDayAndDate(date);
      // Result format: "Sat Jun 15, 2024" (removes first comma from "Sat, Jun 15, 2024")
      expect(result).toMatch(/^[A-Z][a-z]{2} [A-Z][a-z]{2} \d{2}, \d{4}$/);
    });

    it("should include day of week", () => {
      const date = new Date("2024-06-15"); // Saturday
      const result = formatDayAndDate(date);
      expect(result).toContain("Sat");
    });

    it("should include short month name", () => {
      const date = new Date("2024-06-15");
      const result = formatDayAndDate(date);
      expect(result).toContain("Jun");
    });

    it("should include two-digit day", () => {
      const date = new Date("2024-06-05");
      const result = formatDayAndDate(date);
      expect(result).toContain("05");
    });

    it("should include four-digit year", () => {
      const date = new Date("2024-06-15");
      const result = formatDayAndDate(date);
      expect(result).toContain("2024");
    });
  });

  describe("comma removal", () => {
    it("should remove the first comma after weekday", () => {
      const date = new Date("2024-06-15");
      const result = formatDayAndDate(date);
      // Original format is "Sat, Jun 15, 2024", first comma removed -> "Sat Jun 15, 2024"
      // Weekday should not be followed by comma
      expect(result).toMatch(/^[A-Z][a-z]{2} [A-Z]/);
    });

    it("should still contain one comma (between day and year)", () => {
      const date = new Date("2024-06-15");
      const result = formatDayAndDate(date);
      // The second comma remains: "Sat Jun 15, 2024"
      expect(result).toContain(",");
      // Verify only one comma
      const commaCount = (result.match(/,/g) || []).length;
      expect(commaCount).toBe(1);
    });
  });

  describe("all days of the week", () => {
    const weekDays = [
      { date: "2024-06-09", day: "Sun" }, // Sunday
      { date: "2024-06-10", day: "Mon" }, // Monday
      { date: "2024-06-11", day: "Tue" }, // Tuesday
      { date: "2024-06-12", day: "Wed" }, // Wednesday
      { date: "2024-06-13", day: "Thu" }, // Thursday
      { date: "2024-06-14", day: "Fri" }, // Friday
      { date: "2024-06-15", day: "Sat" }, // Saturday
    ];

    weekDays.forEach(({ date, day }) => {
      it(`should format ${day} correctly`, () => {
        const dateObj = new Date(date);
        const result = formatDayAndDate(dateObj);
        expect(result).toContain(day);
      });
    });
  });

  describe("all months", () => {
    const months = [
      { date: "2024-01-15", month: "Jan" },
      { date: "2024-02-15", month: "Feb" },
      { date: "2024-03-15", month: "Mar" },
      { date: "2024-04-15", month: "Apr" },
      { date: "2024-05-15", month: "May" },
      { date: "2024-06-15", month: "Jun" },
      { date: "2024-07-15", month: "Jul" },
      { date: "2024-08-15", month: "Aug" },
      { date: "2024-09-15", month: "Sep" },
      { date: "2024-10-15", month: "Oct" },
      { date: "2024-11-15", month: "Nov" },
      { date: "2024-12-15", month: "Dec" },
    ];

    months.forEach(({ date, month }) => {
      it(`should format ${month} correctly`, () => {
        const dateObj = new Date(date);
        const result = formatDayAndDate(dateObj);
        expect(result).toContain(month);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle first day of month", () => {
      const date = new Date("2024-06-01");
      const result = formatDayAndDate(date);
      expect(result).toContain("01");
    });

    it("should handle last day of month", () => {
      const date = new Date("2024-06-30");
      const result = formatDayAndDate(date);
      expect(result).toContain("30");
    });

    it("should handle leap year date", () => {
      const date = new Date("2024-02-29");
      const result = formatDayAndDate(date);
      expect(result).toContain("Feb");
      expect(result).toContain("29");
    });

    it("should handle new year", () => {
      const date = new Date("2024-01-01");
      const result = formatDayAndDate(date);
      expect(result).toContain("Jan");
      expect(result).toContain("01");
      expect(result).toContain("2024");
    });

    it("should handle end of year", () => {
      const date = new Date("2024-12-31");
      const result = formatDayAndDate(date);
      expect(result).toContain("Dec");
      expect(result).toContain("31");
      expect(result).toContain("2024");
    });
  });

  describe("different years", () => {
    it("should handle dates in the past", () => {
      const date = new Date("2000-01-01");
      const result = formatDayAndDate(date);
      expect(result).toContain("2000");
    });

    it("should handle dates in the future", () => {
      const date = new Date("2030-12-25");
      const result = formatDayAndDate(date);
      expect(result).toContain("2030");
    });
  });
});
