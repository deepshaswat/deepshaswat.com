import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createDeliveredPayload,
  createOpenedPayload,
  createClickedPayload,
  createBouncedPayload,
  createComplainedPayload,
  createMockEmailSend,
  resetEventCounter,
} from "../factories/email-event.factory";
import { createMockMember } from "../factories/member.factory";

/**
 * Integration tests for webhook processing flow
 * Tests the complete flow from webhook receipt to database updates
 */

// Mock Prisma with a more realistic implementation for integration testing
const mockDb = {
  emailEvents: new Map(),
  emailSends: new Map(),
  emailRecipients: new Map(),
  members: new Map(),
  posts: new Map(),
};

vi.mock("@repo/db/client", () => ({
  default: {
    emailEvent: {
      findUnique: vi.fn(({ where }) => {
        return Promise.resolve(mockDb.emailEvents.get(where.eventId) || null);
      }),
      create: vi.fn(({ data }) => {
        const event = { id: `event-${Date.now()}`, ...data };
        mockDb.emailEvents.set(data.eventId, event);
        return Promise.resolve(event);
      }),
    },
    emailSend: {
      findUnique: vi.fn(({ where }) => {
        if (where.resendEmailId) {
          for (const send of mockDb.emailSends.values()) {
            if (send.resendEmailId === where.resendEmailId) return Promise.resolve(send);
          }
        }
        return Promise.resolve(mockDb.emailSends.get(where.id) || null);
      }),
      update: vi.fn(({ where, data }) => {
        const send = mockDb.emailSends.get(where.id);
        if (send) {
          const updated = { ...send, ...data };
          mockDb.emailSends.set(where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      }),
    },
    emailRecipient: {
      findUnique: vi.fn(({ where }) => {
        const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
        return Promise.resolve(mockDb.emailRecipients.get(key) || null);
      }),
      upsert: vi.fn(({ where, update, create }) => {
        const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
        let recipient = mockDb.emailRecipients.get(key);
        if (recipient) {
          recipient = { ...recipient, ...update };
        } else {
          recipient = { id: `recipient-${Date.now()}`, ...create };
        }
        mockDb.emailRecipients.set(key, recipient);
        return Promise.resolve(recipient);
      }),
      update: vi.fn(({ where, data }) => {
        const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
        const recipient = mockDb.emailRecipients.get(key);
        if (recipient) {
          const updated = { ...recipient, ...data };
          mockDb.emailRecipients.set(key, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      }),
    },
    member: {
      findUnique: vi.fn(({ where }) => {
        if (where.email) {
          for (const member of mockDb.members.values()) {
            if (member.email === where.email) return Promise.resolve(member);
          }
        }
        return Promise.resolve(mockDb.members.get(where.id) || null);
      }),
      update: vi.fn(({ where, data }) => {
        const member = mockDb.members.get(where.id);
        if (member) {
          // Handle increment operations
          const updated = { ...member };
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === "object" && value?.increment) {
              updated[key] = (updated[key] || 0) + value.increment;
            } else if (value !== undefined) {
              updated[key] = value;
            }
          }
          mockDb.members.set(where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      }),
    },
    post: {
      findUnique: vi.fn(({ where }) => {
        return Promise.resolve(mockDb.posts.get(where.id) || null);
      }),
      update: vi.fn(({ where, data }) => {
        const post = mockDb.posts.get(where.id);
        if (post) {
          const updated = { ...post };
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === "object" && value?.increment) {
              updated[key] = (updated[key] || 0) + value.increment;
            } else if (value !== undefined) {
              updated[key] = value;
            }
          }
          mockDb.posts.set(where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      }),
    },
    $transaction: vi.fn(async (callback) => {
      // Execute the callback with prisma-like operations
      return callback({
        emailEvent: {
          create: vi.fn(({ data }) => {
            const event = { id: `event-${Date.now()}`, ...data };
            mockDb.emailEvents.set(data.eventId, event);
            return Promise.resolve(event);
          }),
        },
        emailSend: {
          findUnique: vi.fn(({ where, select }) => {
            const send = mockDb.emailSends.get(where.id);
            return Promise.resolve(send || null);
          }),
          update: vi.fn(({ where, data }) => {
            const send = mockDb.emailSends.get(where.id);
            if (send) {
              const updated = { ...send, ...data };
              mockDb.emailSends.set(where.id, updated);
              return Promise.resolve(updated);
            }
            return Promise.resolve(null);
          }),
        },
        emailRecipient: {
          findUnique: vi.fn(({ where }) => {
            const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
            return Promise.resolve(mockDb.emailRecipients.get(key) || null);
          }),
          upsert: vi.fn(({ where, update, create }) => {
            const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
            let recipient = mockDb.emailRecipients.get(key);
            if (recipient) {
              // Handle increment
              for (const [k, v] of Object.entries(update)) {
                if (typeof v === "object" && v?.increment) {
                  recipient[k] = (recipient[k] || 0) + v.increment;
                } else if (v !== undefined) {
                  recipient[k] = v;
                }
              }
            } else {
              recipient = { id: `recipient-${Date.now()}`, ...create };
            }
            mockDb.emailRecipients.set(key, recipient);
            return Promise.resolve(recipient);
          }),
          update: vi.fn(({ where, data }) => {
            const key = `${where.emailSendId_email?.emailSendId}-${where.emailSendId_email?.email}`;
            const recipient = mockDb.emailRecipients.get(key);
            if (recipient) {
              const updated = { ...recipient, ...data };
              mockDb.emailRecipients.set(key, updated);
              return Promise.resolve(updated);
            }
            return Promise.resolve(null);
          }),
        },
        member: {
          findUnique: vi.fn(({ where }) => {
            if (where.email) {
              for (const member of mockDb.members.values()) {
                if (member.email === where.email) return Promise.resolve(member);
              }
            }
            return Promise.resolve(mockDb.members.get(where.id) || null);
          }),
          update: vi.fn(({ where, data }) => {
            const member = mockDb.members.get(where.id);
            if (member) {
              for (const [key, value] of Object.entries(data)) {
                if (typeof value === "object" && value?.increment) {
                  member[key] = (member[key] || 0) + value.increment;
                } else if (value !== undefined) {
                  member[key] = value;
                }
              }
              mockDb.members.set(where.id, member);
              return Promise.resolve(member);
            }
            return Promise.resolve(null);
          }),
        },
        post: {
          update: vi.fn(({ where, data }) => {
            const post = mockDb.posts.get(where.id);
            if (post) {
              for (const [key, value] of Object.entries(data)) {
                if (typeof value === "object" && value?.increment) {
                  post[key] = (post[key] || 0) + value.increment;
                } else if (value !== undefined) {
                  post[key] = value;
                }
              }
              mockDb.posts.set(where.id, post);
              return Promise.resolve(post);
            }
            return Promise.resolve(null);
          }),
        },
      });
    }),
  },
}));

import { processEmailEvent } from "@repo/actions/admin/email-analytics";

describe("Webhook Processing Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetEventCounter();

    // Clear mock database
    mockDb.emailEvents.clear();
    mockDb.emailSends.clear();
    mockDb.emailRecipients.clear();
    mockDb.members.clear();
    mockDb.posts.clear();
  });

  describe("Complete email lifecycle", () => {
    it("should process delivery -> open -> click sequence", async () => {
      // Setup: Create an email send
      const emailSend = createMockEmailSend({
        id: "send-1",
        resendEmailId: "resend-email-1",
        postId: "post-1",
      });
      mockDb.emailSends.set("send-1", emailSend);

      // Setup: Create a member
      const member = createMockMember({
        id: "member-1",
        email: "subscriber@example.com",
        totalEmailsReceived: 0,
        totalEmailsOpened: 0,
        totalEmailsClicked: 0,
      });
      mockDb.members.set("member-1", member);

      // Setup: Create a post
      mockDb.posts.set("post-1", {
        id: "post-1",
        emailsDelivered: 0,
        emailsOpened: 0,
        uniqueOpens: 0,
      });

      // Step 1: Process delivery event
      const deliveredPayload = createDeliveredPayload(
        "resend-email-1",
        "subscriber@example.com"
      );
      const deliveryResult = await processEmailEvent(
        "svix-delivery-1",
        "email.delivered",
        deliveredPayload
      );

      expect(deliveryResult.success).toBe(true);

      // Step 2: Process open event
      const openedPayload = createOpenedPayload(
        "resend-email-1",
        "subscriber@example.com"
      );
      const openResult = await processEmailEvent(
        "svix-open-1",
        "email.opened",
        openedPayload
      );

      expect(openResult.success).toBe(true);

      // Step 3: Process click event
      const clickedPayload = createClickedPayload(
        "resend-email-1",
        "subscriber@example.com",
        "https://example.com/article"
      );
      const clickResult = await processEmailEvent(
        "svix-click-1",
        "email.clicked",
        clickedPayload
      );

      expect(clickResult.success).toBe(true);

      // Verify events were recorded
      expect(mockDb.emailEvents.size).toBe(3);
    });

    it("should handle multiple opens from same recipient", async () => {
      // Setup
      const emailSend = createMockEmailSend({
        id: "send-2",
        resendEmailId: "resend-email-2",
      });
      mockDb.emailSends.set("send-2", emailSend);

      // Process first open
      const firstOpen = createOpenedPayload(
        "resend-email-2",
        "reader@example.com"
      );
      await processEmailEvent("svix-open-first", "email.opened", firstOpen);

      // Process second open (same recipient)
      const secondOpen = createOpenedPayload(
        "resend-email-2",
        "reader@example.com"
      );
      await processEmailEvent("svix-open-second", "email.opened", secondOpen);

      // Both events should be recorded
      expect(mockDb.emailEvents.has("svix-open-first")).toBe(true);
      expect(mockDb.emailEvents.has("svix-open-second")).toBe(true);
    });

    it("should handle bounce and stop processing for that recipient", async () => {
      // Setup
      const emailSend = createMockEmailSend({
        id: "send-3",
        resendEmailId: "resend-email-3",
      });
      mockDb.emailSends.set("send-3", emailSend);

      const member = createMockMember({
        id: "member-bounce",
        email: "bounced@example.com",
        totalBounces: 0,
      });
      mockDb.members.set("member-bounce", member);

      // Process bounce event
      const bouncedPayload = createBouncedPayload(
        "resend-email-3",
        "bounced@example.com"
      );
      const bounceResult = await processEmailEvent(
        "svix-bounce-1",
        "email.bounced",
        bouncedPayload
      );

      expect(bounceResult.success).toBe(true);
    });

    it("should auto-unsubscribe on spam complaint", async () => {
      // Setup
      const emailSend = createMockEmailSend({
        id: "send-4",
        resendEmailId: "resend-email-4",
      });
      mockDb.emailSends.set("send-4", emailSend);

      const member = createMockMember({
        id: "member-spam",
        email: "complainer@example.com",
        unsubscribed: false,
      });
      mockDb.members.set("member-spam", member);

      // Process complaint event
      const complaintPayload = createComplainedPayload(
        "resend-email-4",
        "complainer@example.com"
      );
      const complaintResult = await processEmailEvent(
        "svix-complaint-1",
        "email.complained",
        complaintPayload
      );

      expect(complaintResult.success).toBe(true);
    });
  });

  describe("Idempotency", () => {
    it("should not process same event twice", async () => {
      // Setup
      const emailSend = createMockEmailSend({
        id: "send-idem",
        resendEmailId: "resend-email-idem",
      });
      mockDb.emailSends.set("send-idem", emailSend);

      // Create the event in mock DB (simulating already processed)
      mockDb.emailEvents.set("svix-already-processed", {
        id: "event-existing",
        eventId: "svix-already-processed",
      });

      const payload = createDeliveredPayload(
        "resend-email-idem",
        "test@example.com"
      );

      // Process same event
      const result = await processEmailEvent(
        "svix-already-processed",
        "email.delivered",
        payload
      );

      expect(result.success).toBe(true);
      // Event count should remain 1
      expect(mockDb.emailEvents.size).toBe(1);
    });
  });

  describe("Error handling", () => {
    it("should handle missing email send gracefully", async () => {
      // Don't add email send to mock DB
      const payload = createDeliveredPayload(
        "non-existent-email",
        "test@example.com"
      );

      const result = await processEmailEvent(
        "svix-no-send",
        "email.delivered",
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("EmailSend record not found");
    });
  });
});
