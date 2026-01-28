import { describe, it, expect } from "vitest";
import {
  convertFiltersToQuery,
  createInitialFilter,
  type Filter,
  type MemberFilters,
} from "../../apps/admin/app/(auth)/_components/members/filter-list-components";

describe("Filter List Components Helpers", () => {
  describe("createInitialFilter", () => {
    it("should create a filter with default values", () => {
      const filter = createInitialFilter();

      expect(filter).toMatchObject({
        category: "Name",
        operator: "contains",
        value: "",
      });
      expect(filter.id).toBeDefined();
      expect(typeof filter.id).toBe("string");
      expect(filter.id.length).toBeGreaterThan(0);
    });

    it("should create unique IDs for each filter", () => {
      const filter1 = createInitialFilter();
      const filter2 = createInitialFilter();

      expect(filter1.id).not.toBe(filter2.id);
    });
  });

  describe("convertFiltersToQuery", () => {
    it("should convert empty filters to empty query", () => {
      const filters: Filter[] = [];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({});
    });

    it("should ignore filters with empty values", () => {
      const filters: Filter[] = [
        { id: "1", category: "Name", operator: "contains", value: "" },
        { id: "2", category: "Email", operator: "contains", value: "" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({});
    });

    it("should convert Name filter", () => {
      const filters: Filter[] = [
        { id: "1", category: "Name", operator: "contains", value: "John" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        name: { operator: "contains", value: "John" },
      });
    });

    it("should convert Name filter with different operators", () => {
      const operators = ["contains", "does not contain", "starts with", "ends with"];

      for (const operator of operators) {
        const filters: Filter[] = [
          { id: "1", category: "Name", operator, value: "Test" },
        ];
        const result = convertFiltersToQuery(filters);

        expect(result.name).toEqual({ operator, value: "Test" });
      }
    });

    it("should convert Email filter", () => {
      const filters: Filter[] = [
        { id: "1", category: "Email", operator: "is", value: "test@example.com" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        email: { operator: "is", value: "test@example.com" },
      });
    });

    it("should convert Email filter with contains operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Email", operator: "contains", value: "example" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        email: { operator: "contains", value: "example" },
      });
    });

    it("should convert Newsletter subscription filter - subscribed", () => {
      const filters: Filter[] = [
        { id: "1", category: "Newsletter subscription", operator: "is", value: "subscribed" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        subscriptionStatus: "subscribed",
      });
    });

    it("should convert Newsletter subscription filter - unsubscribed", () => {
      const filters: Filter[] = [
        { id: "1", category: "Newsletter subscription", operator: "is", value: "unsubscribed" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        subscriptionStatus: "unsubscribed",
      });
    });

    it("should convert Location filter", () => {
      const filters: Filter[] = [
        { id: "1", category: "Location", operator: "contains", value: "California" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        location: { operator: "contains", value: "California" },
      });
    });

    it("should convert Location filter with is operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Location", operator: "is", value: "New York" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        location: { operator: "is", value: "New York" },
      });
    });

    it("should convert Created date filter with 'is' operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Created", operator: "is", value: "2024-01-15" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        createdAt: { operator: "is", value: "2024-01-15" },
      });
    });

    it("should convert Created date filter with 'is before' operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Created", operator: "is before", value: "2024-06-01" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        createdAt: { operator: "is before", value: "2024-06-01" },
      });
    });

    it("should convert Created date filter with 'is after' operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Created", operator: "is after", value: "2024-01-01" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        createdAt: { operator: "is after", value: "2024-01-01" },
      });
    });

    it("should convert Created date filter with 'is on or before' operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Created", operator: "is on or before", value: "2024-12-31" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        createdAt: { operator: "is on or before", value: "2024-12-31" },
      });
    });

    it("should convert Created date filter with 'is on or after' operator", () => {
      const filters: Filter[] = [
        { id: "1", category: "Created", operator: "is on or after", value: "2024-01-01" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        createdAt: { operator: "is on or after", value: "2024-01-01" },
      });
    });

    it("should convert multiple filters", () => {
      const filters: Filter[] = [
        { id: "1", category: "Name", operator: "contains", value: "John" },
        { id: "2", category: "Email", operator: "contains", value: "example" },
        { id: "3", category: "Newsletter subscription", operator: "is", value: "subscribed" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        name: { operator: "contains", value: "John" },
        email: { operator: "contains", value: "example" },
        subscriptionStatus: "subscribed",
      });
    });

    it("should only keep the last filter when duplicates exist", () => {
      const filters: Filter[] = [
        { id: "1", category: "Name", operator: "contains", value: "John" },
        { id: "2", category: "Name", operator: "starts with", value: "Jane" },
      ];
      const result = convertFiltersToQuery(filters);

      // Last filter wins
      expect(result).toEqual({
        name: { operator: "starts with", value: "Jane" },
      });
    });

    it("should handle all filter types in one query", () => {
      const filters: Filter[] = [
        { id: "1", category: "Name", operator: "contains", value: "John" },
        { id: "2", category: "Email", operator: "ends with", value: "@company.com" },
        { id: "3", category: "Newsletter subscription", operator: "is", value: "subscribed" },
        { id: "4", category: "Location", operator: "contains", value: "USA" },
        { id: "5", category: "Created", operator: "is after", value: "2024-01-01" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        name: { operator: "contains", value: "John" },
        email: { operator: "ends with", value: "@company.com" },
        subscriptionStatus: "subscribed",
        location: { operator: "contains", value: "USA" },
        createdAt: { operator: "is after", value: "2024-01-01" },
      });
    });

    it("should skip filters with unknown categories", () => {
      const filters: Filter[] = [
        { id: "1", category: "Unknown Category" as string, operator: "contains", value: "test" },
        { id: "2", category: "Name", operator: "contains", value: "John" },
      ];
      const result = convertFiltersToQuery(filters);

      expect(result).toEqual({
        name: { operator: "contains", value: "John" },
      });
    });
  });

  describe("Filter type inference", () => {
    it("should have correct Filter interface shape", () => {
      const filter: Filter = {
        id: "test-id",
        category: "Name",
        operator: "contains",
        value: "test value",
      };

      expect(filter.id).toBe("test-id");
      expect(filter.category).toBe("Name");
      expect(filter.operator).toBe("contains");
      expect(filter.value).toBe("test value");
    });

    it("should have correct MemberFilters interface shape", () => {
      const memberFilters: MemberFilters = {
        name: { operator: "contains", value: "John" },
        email: { operator: "is", value: "test@example.com" },
        subscriptionStatus: "subscribed",
        location: { operator: "contains", value: "NYC" },
        createdAt: { operator: "is after", value: "2024-01-01" },
      };

      expect(memberFilters.name?.operator).toBe("contains");
      expect(memberFilters.name?.value).toBe("John");
      expect(memberFilters.email?.operator).toBe("is");
      expect(memberFilters.subscriptionStatus).toBe("subscribed");
      expect(memberFilters.location?.value).toBe("NYC");
      expect(memberFilters.createdAt?.operator).toBe("is after");
    });

    it("should allow partial MemberFilters", () => {
      const partialFilters: MemberFilters = {
        name: { operator: "contains", value: "Test" },
      };

      expect(partialFilters.name).toBeDefined();
      expect(partialFilters.email).toBeUndefined();
      expect(partialFilters.subscriptionStatus).toBeUndefined();
    });
  });
});
