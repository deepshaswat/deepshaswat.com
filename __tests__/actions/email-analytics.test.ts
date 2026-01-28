import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createDeliveredPayload,
  createOpenedPayload,
  createClickedPayload,
  createBouncedPayload,
  createComplainedPayload,
  createMockEmailSend,
  createMockEmailRecipient,
  resetEventCounter,
} from "../factories/email-event.factory";
import { createMockMember } from "../factories/member.factory";
import { createMockNewsletter } from "../factories/post.factory";

// Mock Prisma
vi.mock("@repo/db/client", () => ({
  default: {
    emailSend: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    emailRecipient: {
      create: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    emailEvent: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    member: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      emailEvent: {
        create: vi.fn(),
      },
      emailSend: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      emailRecipient: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      member: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      post: {
        update: vi.fn(),
      },
    })),
  },
}));

import prisma from "@repo/db/client";
import {
  processEmailEvent,
  fetchEmailAnalyticsOverview,
  fetchNewsletterPerformance,
  recalculateMemberEngagement,
  createEmailSendRecord,
} from "@repo/actions/admin/email-analytics";

const mockPrisma = prisma as unknown as {
  emailSend: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  emailRecipient: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  emailEvent: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
  member: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  post: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

describe("Email Analytics Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetEventCounter();
  });

  describe("processEmailEvent", () => {
    it("should skip already processed events (idempotency)", async () => {
      mockPrisma.emailEvent.findUnique.mockResolvedValue({
        id: "existing-event",
        eventId: "svix-123",
      });

      const payload = createDeliveredPayload("email-1", "test@example.com");
      const result = await processEmailEvent("svix-123", "email.delivered", payload);

      expect(result.success).toBe(true);
      // Should not process further
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it("should return error when EmailSend not found", async () => {
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(null);

      const payload = createDeliveredPayload("unknown-email", "test@example.com");
      const result = await processEmailEvent("svix-456", "email.delivered", payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe("EmailSend record not found");
    });

    it("should process email.delivered event", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);

      const payload = createDeliveredPayload("email-123", "test@example.com");
      const result = await processEmailEvent("svix-delivered", "email.delivered", payload);

      expect(result.success).toBe(true);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it("should process email.opened event", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);

      const payload = createOpenedPayload("email-123", "test@example.com");
      const result = await processEmailEvent("svix-opened", "email.opened", payload);

      expect(result.success).toBe(true);
    });

    it("should process email.clicked event", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);

      const payload = createClickedPayload(
        "email-123",
        "test@example.com",
        "https://example.com/article"
      );
      const result = await processEmailEvent("svix-clicked", "email.clicked", payload);

      expect(result.success).toBe(true);
    });

    it("should process email.bounced event", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);

      const payload = createBouncedPayload("email-123", "bounce@example.com");
      const result = await processEmailEvent("svix-bounced", "email.bounced", payload);

      expect(result.success).toBe(true);
    });

    it("should process email.complained event and unsubscribe member", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);

      const payload = createComplainedPayload("email-123", "spam@example.com");
      const result = await processEmailEvent("svix-complained", "email.complained", payload);

      expect(result.success).toBe(true);
    });

    it("should store unknown event types", async () => {
      const emailSend = createMockEmailSend({ resendEmailId: "email-123" });
      mockPrisma.emailEvent.findUnique.mockResolvedValue(null);
      mockPrisma.emailSend.findUnique.mockResolvedValue(emailSend);
      mockPrisma.emailEvent.create.mockResolvedValue({ id: "event-1" });

      const payload = {
        type: "email.unknown",
        created_at: new Date().toISOString(),
        data: {
          email_id: "email-123",
          from: "test@example.com",
          to: ["recipient@example.com"],
          subject: "Test",
        },
      };

      const result = await processEmailEvent("svix-unknown", "email.unknown", payload);

      expect(result.success).toBe(true);
      expect(mockPrisma.emailEvent.create).toHaveBeenCalled();
    });
  });

  describe("fetchEmailAnalyticsOverview", () => {
    it("should calculate analytics overview correctly", async () => {
      mockPrisma.emailSend.count
        .mockResolvedValueOnce(1000) // total sent
        .mockResolvedValueOnce(950)  // delivered
        .mockResolvedValueOnce(400)  // opened
        .mockResolvedValueOnce(100)  // clicked
        .mockResolvedValueOnce(20);  // bounced

      const result = await fetchEmailAnalyticsOverview();

      expect(result.totalSent).toBe(1000);
      expect(result.totalDelivered).toBe(950);
      expect(result.totalOpened).toBe(400);
      expect(result.totalClicked).toBe(100);
      expect(result.totalBounced).toBe(20);
      expect(result.deliveryRate).toBe(95);
      expect(result.openRate).toBe(40);
      expect(result.clickRate).toBe(10);
      expect(result.bounceRate).toBe(2);
    });

    it("should handle zero emails sent", async () => {
      mockPrisma.emailSend.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await fetchEmailAnalyticsOverview();

      expect(result.totalSent).toBe(0);
      expect(result.deliveryRate).toBe(0); // Prevented division by zero
    });
  });

  describe("fetchNewsletterPerformance", () => {
    it("should return newsletter performance metrics", async () => {
      const mockPost = createMockNewsletter({
        id: "post-1",
        title: "Test Newsletter",
        emailsSent: 100,
        emailsDelivered: 95,
        emailsOpened: 45,
        uniqueOpens: 40,
      });

      const mockEmailSend = createMockEmailSend({
        postId: "post-1",
        sentAt: new Date(),
      });

      mockPrisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        emailSends: [
          {
            ...mockEmailSend,
            recipients: [
              createMockEmailRecipient(mockEmailSend.id, "r1@example.com", { clicked: true }),
              createMockEmailRecipient(mockEmailSend.id, "r2@example.com", { clicked: false }),
              createMockEmailRecipient(mockEmailSend.id, "r3@example.com", { bounced: true }),
            ],
          },
        ],
      });

      const result = await fetchNewsletterPerformance("post-1");

      expect(result).not.toBeNull();
      expect(result?.postId).toBe("post-1");
      expect(result?.totalSent).toBe(100);
      expect(result?.delivered).toBe(95);
      expect(result?.clicked).toBe(1);
      expect(result?.bounced).toBe(1);
    });

    it("should return null when post not found", async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);

      const result = await fetchNewsletterPerformance("non-existent");

      expect(result).toBeNull();
    });

    it("should return null when no emailSends", async () => {
      const mockPost = createMockNewsletter({ id: "post-1" });
      mockPrisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        emailSends: [],
      });

      const result = await fetchNewsletterPerformance("post-1");

      expect(result).toBeNull();
    });
  });

  describe("recalculateMemberEngagement", () => {
    it("should calculate engagement score for active member", async () => {
      const member = createMockMember({
        id: "member-1",
        totalEmailsReceived: 100,
        totalEmailsOpened: 75,
        totalEmailsClicked: 20,
        totalBounces: 0,
        lastEmailOpenedAt: new Date(), // Recent activity
      });

      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.member.update.mockResolvedValue(member);

      await recalculateMemberEngagement("member-1");

      expect(mockPrisma.member.update).toHaveBeenCalledWith({
        where: { id: "member-1" },
        data: expect.objectContaining({
          engagementScore: expect.any(Number),
          openRate: expect.stringMatching(/\d+\.\d%/),
        }),
      });
    });

    it("should penalize bounces in engagement score", async () => {
      const memberWithBounces = createMockMember({
        id: "member-1",
        totalEmailsReceived: 100,
        totalEmailsOpened: 50,
        totalEmailsClicked: 10,
        totalBounces: 20, // 20% bounce rate
        lastEmailOpenedAt: new Date(),
      });

      mockPrisma.member.findUnique.mockResolvedValue(memberWithBounces);
      mockPrisma.member.update.mockResolvedValue(memberWithBounces);

      await recalculateMemberEngagement("member-1");

      const updateCall = mockPrisma.member.update.mock.calls[0][0];
      expect(updateCall.data.engagementScore).toBeLessThan(100);
    });

    it("should boost score for recent activity", async () => {
      const recentlyActive = createMockMember({
        id: "member-1",
        totalEmailsReceived: 50,
        totalEmailsOpened: 25,
        totalEmailsClicked: 5,
        lastEmailOpenedAt: new Date(), // Today
      });

      mockPrisma.member.findUnique.mockResolvedValue(recentlyActive);
      mockPrisma.member.update.mockResolvedValue(recentlyActive);

      await recalculateMemberEngagement("member-1");

      expect(mockPrisma.member.update).toHaveBeenCalled();
    });

    it("should do nothing if member not found", async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await recalculateMemberEngagement("non-existent");

      expect(mockPrisma.member.update).not.toHaveBeenCalled();
    });
  });

  describe("createEmailSendRecord", () => {
    it("should create email send record", async () => {
      const mockEmailSend = createMockEmailSend();
      mockPrisma.emailSend.create.mockResolvedValue(mockEmailSend);
      mockPrisma.post.update.mockResolvedValue({});

      const result = await createEmailSendRecord(
        "resend-email-123",
        "broadcast-123",
        "post-1",
        "Newsletter Subject",
        "sender@example.com",
        150
      );

      expect(result).toBe(mockEmailSend.id);
      expect(mockPrisma.emailSend.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resendEmailId: "resend-email-123",
          broadcastId: "broadcast-123",
          postId: "post-1",
          subject: "Newsletter Subject",
          fromEmail: "sender@example.com",
          status: "SENT",
        }),
      });
    });

    it("should update post emailsSent count", async () => {
      const mockEmailSend = createMockEmailSend();
      mockPrisma.emailSend.create.mockResolvedValue(mockEmailSend);
      mockPrisma.post.update.mockResolvedValue({});

      await createEmailSendRecord(
        "resend-email-123",
        null,
        "post-1",
        "Newsletter",
        "sender@example.com",
        200
      );

      expect(mockPrisma.post.update).toHaveBeenCalledWith({
        where: { id: "post-1" },
        data: { emailsSent: 200 },
      });
    });

    it("should not update post if postId is null", async () => {
      const mockEmailSend = createMockEmailSend();
      mockPrisma.emailSend.create.mockResolvedValue(mockEmailSend);

      await createEmailSendRecord(
        "resend-email-123",
        "broadcast-123",
        null, // No post ID
        "Standalone Email",
        "sender@example.com",
        50
      );

      expect(mockPrisma.post.update).not.toHaveBeenCalled();
    });
  });
});
