import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockMember, resetMemberCounter } from "../factories/member.factory";

// Mock dependencies
vi.mock("@clerk/nextjs", () => ({
  SignedIn: Promise.resolve(true),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@repo/db/client", () => ({
  default: {
    member: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("../../packages/actions/src/common/resend", () => ({
  addContactToAudience: vi.fn().mockResolvedValue({
    data: { id: "resend-contact-123" },
    success: true,
  }),
  updateContactAudience: vi.fn().mockResolvedValue({ success: true }),
  deleteContactAudience: vi.fn().mockResolvedValue({ success: true }),
}));

import prisma from "@repo/db/client";
import {
  fetchMembers,
  countFilteredMembers,
  type MemberFilters,
} from "@repo/actions/admin/crud-member";

const mockPrisma = prisma as unknown as {
  member: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

describe("Member Filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMemberCounter();
  });

  describe("fetchMembers with filters", () => {
    it("should fetch members without filters", async () => {
      const members = [createMockMember(), createMockMember()];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const result = await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
      });

      expect(result).toHaveLength(2);
      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 30,
          orderBy: { createdAt: "desc" },
        })
      );
    });

    it("should filter by name with 'contains' operator", async () => {
      const members = [createMockMember({ firstName: "John", lastName: "Doe" })];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const filters: MemberFilters = {
        name: { operator: "contains", value: "John" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [
                  { firstName: { contains: "John" } },
                  { lastName: { contains: "John" } },
                ],
              }),
            ]),
          }),
        })
      );
    });

    it("should filter by name with 'starts with' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        name: { operator: "starts with", value: "Jo" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [
                  { firstName: { startsWith: "Jo" } },
                  { lastName: { startsWith: "Jo" } },
                ],
              }),
            ]),
          }),
        })
      );
    });

    it("should filter by name with 'ends with' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        name: { operator: "ends with", value: "hn" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [
                  { firstName: { endsWith: "hn" } },
                  { lastName: { endsWith: "hn" } },
                ],
              }),
            ]),
          }),
        })
      );
    });

    it("should filter by email with 'contains' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        email: { operator: "contains", value: "example" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { email: { contains: "example" } },
            ]),
          }),
        })
      );
    });

    it("should filter by email with 'is' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        email: { operator: "is", value: "test@example.com" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { email: { equals: "test@example.com" } },
            ]),
          }),
        })
      );
    });

    it("should filter by subscription status - subscribed", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        subscriptionStatus: "subscribed",
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { unsubscribed: false },
            ]),
          }),
        })
      );
    });

    it("should filter by subscription status - unsubscribed", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        subscriptionStatus: "unsubscribed",
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { unsubscribed: true },
            ]),
          }),
        })
      );
    });

    it("should filter by location with 'contains' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        location: { operator: "contains", value: "New York" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { location: { contains: "New York" } },
            ]),
          }),
        })
      );
    });

    it("should filter by createdAt with 'is after' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        createdAt: { operator: "is after", value: "2024-01-15" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                createdAt: expect.objectContaining({
                  gt: expect.any(Date),
                }),
              }),
            ]),
          }),
        })
      );
    });

    it("should filter by createdAt with 'is before' operator", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        createdAt: { operator: "is before", value: "2024-06-01" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                createdAt: expect.objectContaining({
                  lt: expect.any(Date),
                }),
              }),
            ]),
          }),
        })
      );
    });

    it("should combine multiple filters", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        name: { operator: "contains", value: "John" },
        subscriptionStatus: "subscribed",
        location: { operator: "contains", value: "USA" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      const calledWith = mockPrisma.member.findMany.mock.calls[0][0];
      expect(calledWith.where.AND).toHaveLength(3);
    });

    it("should combine search with filters", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        subscriptionStatus: "subscribed",
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "test",
        filters,
      });

      const calledWith = mockPrisma.member.findMany.mock.calls[0][0];
      // Should have both search OR condition and filter condition
      expect(calledWith.where.AND.length).toBeGreaterThanOrEqual(2);
    });

    it("should ignore filters with empty values", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      const filters: MemberFilters = {
        name: { operator: "contains", value: "" },
        email: { operator: "contains", value: "" },
      };

      await fetchMembers({
        pageNumber: 0,
        pageSize: 30,
        search: "",
        filters,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: undefined,
        })
      );
    });
  });

  describe("countFilteredMembers", () => {
    it("should count members without filters", async () => {
      mockPrisma.member.count.mockResolvedValue(100);

      const result = await countFilteredMembers({
        search: "",
      });

      expect(result).toBe(100);
      expect(mockPrisma.member.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: undefined,
        })
      );
    });

    it("should count members with search term", async () => {
      mockPrisma.member.count.mockResolvedValue(25);

      const result = await countFilteredMembers({
        search: "john",
      });

      expect(result).toBe(25);
      expect(mockPrisma.member.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { firstName: { contains: "john", mode: "insensitive" } },
                ]),
              }),
            ]),
          }),
        })
      );
    });

    it("should count members with subscription filter", async () => {
      mockPrisma.member.count.mockResolvedValue(50);

      const filters: MemberFilters = {
        subscriptionStatus: "subscribed",
      };

      const result = await countFilteredMembers({
        search: "",
        filters,
      });

      expect(result).toBe(50);
      expect(mockPrisma.member.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { unsubscribed: false },
            ]),
          }),
        })
      );
    });

    it("should count members with name filter", async () => {
      mockPrisma.member.count.mockResolvedValue(10);

      const filters: MemberFilters = {
        name: { operator: "starts with", value: "A" },
      };

      const result = await countFilteredMembers({
        search: "",
        filters,
      });

      expect(result).toBe(10);
      expect(mockPrisma.member.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [
                  { firstName: { startsWith: "A" } },
                  { lastName: { startsWith: "A" } },
                ],
              }),
            ]),
          }),
        })
      );
    });

    it("should count members with date filter", async () => {
      mockPrisma.member.count.mockResolvedValue(75);

      const filters: MemberFilters = {
        createdAt: { operator: "is on or after", value: "2024-01-01" },
      };

      const result = await countFilteredMembers({
        search: "",
        filters,
      });

      expect(result).toBe(75);
      expect(mockPrisma.member.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                createdAt: expect.objectContaining({
                  gte: expect.any(Date),
                }),
              }),
            ]),
          }),
        })
      );
    });

    it("should count members with combined search and filters", async () => {
      mockPrisma.member.count.mockResolvedValue(5);

      const filters: MemberFilters = {
        subscriptionStatus: "subscribed",
        location: { operator: "contains", value: "CA" },
      };

      const result = await countFilteredMembers({
        search: "test",
        filters,
      });

      expect(result).toBe(5);
      const calledWith = mockPrisma.member.count.mock.calls[0][0];
      expect(calledWith.where.AND.length).toBeGreaterThanOrEqual(3);
    });

    it("should handle errors gracefully", async () => {
      mockPrisma.member.count.mockRejectedValue(new Error("Database error"));

      await expect(
        countFilteredMembers({
          search: "",
        })
      ).rejects.toThrow("Database error");
    });
  });
});
