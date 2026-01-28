import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMockMember,
  createMockActiveMember,
  createMockUnsubscribedMember,
  resetMemberCounter,
} from "../factories/member.factory";

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
  createMember,
  fetchMembers,
  fetchMemberDetails,
  updateMember,
  deleteMember,
  unsubscribeMember,
  totalMembers,
  importMembers,
} from "@repo/actions/admin/crud-member";
import {
  addContactToAudience,
  updateContactAudience,
  deleteContactAudience,
} from "../../packages/actions/src/common/resend";

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

describe("Member CRUD Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMemberCounter();
  });

  describe("createMember", () => {
    it("should create a new member", async () => {
      const mockMember = createMockMember();
      mockPrisma.member.findUnique.mockResolvedValue(null);
      mockPrisma.member.create.mockResolvedValue(mockMember);
      mockPrisma.member.update.mockResolvedValue(mockMember);

      const result = await createMember({
        email: "new@example.com",
        firstName: "Test",
        lastName: "User",
        unsubscribed: false,
      });

      expect(mockPrisma.member.create).toHaveBeenCalled();
      expect(addContactToAudience).toHaveBeenCalledWith({
        email: "new@example.com",
        firstName: "Test",
        lastName: "User",
        unsubscribed: false,
      });
    });

    it("should return existing member if already subscribed", async () => {
      const existingMember = createMockMember({ unsubscribed: false });
      mockPrisma.member.findUnique.mockResolvedValue(existingMember);

      const result = await createMember({
        email: existingMember.email,
        firstName: "Test",
        lastName: "User",
        unsubscribed: false,
      });

      expect(result).toEqual(existingMember);
      expect(mockPrisma.member.create).not.toHaveBeenCalled();
    });

    it("should resubscribe an unsubscribed member", async () => {
      const unsubscribedMember = createMockUnsubscribedMember();
      mockPrisma.member.findUnique.mockResolvedValue(unsubscribedMember);
      mockPrisma.member.update.mockResolvedValue({
        ...unsubscribedMember,
        unsubscribed: false,
      });

      const result = await createMember({
        email: unsubscribedMember.email,
        firstName: "Test",
        lastName: "User",
        unsubscribed: false,
      });

      expect(mockPrisma.member.update).toHaveBeenCalledWith({
        where: { id: unsubscribedMember.id },
        data: { unsubscribed: false },
      });
      expect(updateContactAudience).toHaveBeenCalledWith({
        id: unsubscribedMember.resendContactId,
        unsubscribed: false,
      });
    });

    it("should handle create errors", async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      mockPrisma.member.create.mockRejectedValue(new Error("Database error"));

      await expect(
        createMember({
          email: "error@example.com",
          firstName: "Test",
          lastName: "User",
          unsubscribed: false,
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("fetchMembers", () => {
    it("should fetch members with pagination", async () => {
      const members = [createMockMember(), createMockMember()];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const result = await fetchMembers({
        pageNumber: 0,
        pageSize: 10,
        search: "",
      });

      expect(result).toHaveLength(2);
      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { firstName: { contains: "" } },
            { lastName: { contains: "" } },
            { email: { contains: "" } },
          ],
          unsubscribed: undefined,
        },
      });
    });

    it("should filter members by search term", async () => {
      const members = [createMockMember({ firstName: "John" })];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const result = await fetchMembers({
        pageNumber: 0,
        pageSize: 10,
        search: "John",
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { firstName: { contains: "John" } },
            ]),
          }),
        })
      );
    });

    it("should filter by subscription status", async () => {
      const members = [createMockMember({ unsubscribed: false })];
      mockPrisma.member.findMany.mockResolvedValue(members);

      await fetchMembers({
        pageNumber: 0,
        pageSize: 10,
        search: "",
        isSubscribed: false,
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            unsubscribed: false,
          }),
        })
      );
    });

    it("should handle pagination correctly", async () => {
      mockPrisma.member.findMany.mockResolvedValue([]);

      await fetchMembers({
        pageNumber: 2,
        pageSize: 20,
        search: "",
      });

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40,
          take: 20,
        })
      );
    });
  });

  describe("fetchMemberDetails", () => {
    it("should fetch member by id", async () => {
      const member = createMockActiveMember();
      mockPrisma.member.findUnique.mockResolvedValue(member);

      const result = await fetchMemberDetails("member-1");

      expect(result).toEqual(member);
      expect(mockPrisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: "member-1" },
      });
    });

    it("should return null when member not found", async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      const result = await fetchMemberDetails("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updateMember", () => {
    it("should update member details", async () => {
      const member = createMockMember();
      mockPrisma.member.update.mockResolvedValue(member);

      await updateMember("member-1", {
        ...member,
        firstName: "Updated",
        lastName: "Name",
      });

      expect(mockPrisma.member.update).toHaveBeenCalledWith({
        where: { id: "member-1" },
        data: expect.objectContaining({
          firstName: "Updated",
          lastName: "Name",
        }),
      });
    });

    it("should sync with Resend audience", async () => {
      const member = createMockMember({ resendContactId: "resend-123" });

      await updateMember("member-1", member);

      expect(updateContactAudience).toHaveBeenCalledWith({
        id: "resend-123",
        firstName: member.firstName,
        lastName: member.lastName,
        unsubscribed: member.unsubscribed,
      });
    });

    it("should not call Resend if no resendContactId", async () => {
      const member = createMockMember({ resendContactId: null });

      await updateMember("member-1", member);

      expect(updateContactAudience).not.toHaveBeenCalled();
    });
  });

  describe("deleteMember", () => {
    it("should delete member and remove from Resend audience", async () => {
      const member = createMockMember({ resendContactId: "resend-123" });
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.member.delete.mockResolvedValue(member);

      await deleteMember("member-1");

      expect(deleteContactAudience).toHaveBeenCalledWith("resend-123");
      expect(mockPrisma.member.delete).toHaveBeenCalledWith({
        where: { id: "member-1" },
      });
    });

    it("should handle member without resendContactId", async () => {
      const member = createMockMember({ resendContactId: null });
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.member.delete.mockResolvedValue(member);

      await deleteMember("member-1");

      expect(deleteContactAudience).not.toHaveBeenCalled();
      expect(mockPrisma.member.delete).toHaveBeenCalled();
    });

    it("should do nothing if member not found", async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await deleteMember("non-existent");

      expect(mockPrisma.member.delete).not.toHaveBeenCalled();
    });
  });

  describe("unsubscribeMember", () => {
    it("should unsubscribe an active member", async () => {
      const member = createMockMember({ unsubscribed: false });
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.member.update.mockResolvedValue({
        ...member,
        unsubscribed: true,
      });

      const result = await unsubscribeMember(member.email);

      expect(mockPrisma.member.update).toHaveBeenCalledWith({
        where: { id: member.id },
        data: { unsubscribed: true },
      });
      expect(updateContactAudience).toHaveBeenCalledWith({
        id: member.resendContactId,
        unsubscribed: true,
      });
    });

    it("should return member if already unsubscribed", async () => {
      const member = createMockUnsubscribedMember();
      mockPrisma.member.findUnique.mockResolvedValue(member);

      const result = await unsubscribeMember(member.email);

      expect(result).toEqual(member);
      expect(mockPrisma.member.update).not.toHaveBeenCalled();
    });
  });

  describe("totalMembers", () => {
    it("should return total member count", async () => {
      mockPrisma.member.count.mockResolvedValue(150);

      const result = await totalMembers();

      expect(result).toBe(150);
    });
  });

  describe("importMembers", () => {
    it("should import multiple members", async () => {
      const member1 = createMockMember();
      const member2 = createMockMember();

      mockPrisma.member.findUnique.mockResolvedValue(null);
      mockPrisma.member.create
        .mockResolvedValueOnce(member1)
        .mockResolvedValueOnce(member2);
      mockPrisma.member.update.mockResolvedValue({});

      const result = await importMembers([
        { email: "import1@example.com", firstName: "Import", lastName: "One" },
        { email: "import2@example.com", firstName: "Import", lastName: "Two" },
      ]);

      expect(result.success).toBe("Members imported successfully");
      expect(result.count).toBe(2);
    });

    it("should handle import errors", async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      mockPrisma.member.create.mockRejectedValue(new Error("Import error"));

      const result = await importMembers([
        { email: "error@example.com", firstName: "Error", lastName: "Test" },
      ]);

      expect(result.error).toBe("Error importing members");
    });
  });
});
