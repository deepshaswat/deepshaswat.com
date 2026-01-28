import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockPost, createMockNewsletter } from "../factories/post.factory";

// Create mock functions first
const mockEmailsSend = vi.fn();
const mockBroadcastsCreate = vi.fn();
const mockBroadcastsSend = vi.fn();
const mockContactsCreate = vi.fn();
const mockContactsUpdate = vi.fn();
const mockContactsRemove = vi.fn();
const mockContactsGet = vi.fn();
const mockAudiencesGet = vi.fn();

// Mock Resend module
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockEmailsSend },
    broadcasts: {
      create: mockBroadcastsCreate,
      send: mockBroadcastsSend,
    },
    contacts: {
      create: mockContactsCreate,
      update: mockContactsUpdate,
      remove: mockContactsRemove,
      get: mockContactsGet,
    },
    audiences: { get: mockAudiencesGet },
  })),
}));

// Mock UI components
vi.mock("@repo/ui", () => ({
  EmailTemplate: vi.fn(() => "<div>Email Template</div>"),
  NewsletterTemplate: vi.fn(() => "<div>Newsletter Template</div>"),
}));

// Mock email analytics
vi.mock("../../packages/actions/src/admin/email-analytics", () => ({
  createEmailSendRecord: vi.fn().mockResolvedValue("email-send-123"),
}));

// Set environment variables before importing
process.env.RESEND_API_KEY = "test-api-key";
process.env.RESEND_AUDIENCE_ID = "test-audience-id";

describe("Resend Email Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockEmailsSend.mockResolvedValue({
      data: { id: "email-123" },
      error: null,
    });

    mockBroadcastsCreate.mockResolvedValue({
      data: { id: "broadcast-123" },
      error: null,
    });

    mockBroadcastsSend.mockResolvedValue({
      data: { id: "broadcast-send-123" },
      error: null,
    });

    mockContactsCreate.mockResolvedValue({
      data: { id: "contact-123" },
      error: null,
    });

    mockContactsUpdate.mockResolvedValue({
      data: { id: "contact-123" },
      error: null,
    });

    mockContactsGet.mockResolvedValue({
      data: { id: "contact-123" },
      error: null,
    });

    mockContactsRemove.mockResolvedValue({
      data: { deleted: true },
      error: null,
    });

    mockAudiencesGet.mockResolvedValue({
      data: { id: "audience-123" },
      error: null,
    });
  });

  describe("sendEmail", () => {
    it("should send contact form email successfully", async () => {
      // Import dynamically to get fresh module with mocks
      const { sendEmail } = await import("@repo/actions/common/resend");

      const result = await sendEmail(
        "John Doe",
        "john@example.com",
        "Hello, this is a test message."
      );

      expect(result.success).toBe("Message sent!");
      expect(result.data).toBeDefined();
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining("Shaswat Deep"),
          to: "hi@deepshaswat.com",
          subject: expect.stringContaining("Email from: John Doe"),
          replyTo: "john@example.com",
        })
      );
    });

    it("should handle send errors", async () => {
      mockEmailsSend.mockResolvedValue({
        data: null,
        error: { message: "Send failed" },
      });

      const { sendEmail } = await import("@repo/actions/common/resend");
      const result = await sendEmail("Test", "test@example.com", "Message");

      expect(result.error).toBe("Something went wrong!");
    });
  });

  describe("sendNewsletter", () => {
    it("should send newsletter to single recipient", async () => {
      const post = createMockNewsletter({
        title: "Test Newsletter",
      });

      const { sendNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: { status: "PUBLISHED" },
        markdown: "# Newsletter Content",
      });

      expect(result.success).toBe(true);
      expect(mockEmailsSend).toHaveBeenCalled();
    });

    it("should schedule newsletter for later", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const post = createMockNewsletter({ title: "Scheduled Newsletter" });

      const { sendNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "SCHEDULED",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: {
          status: "SCHEDULED",
          publishDate: futureDate,
        },
        markdown: "# Scheduled Content",
      });

      expect(result.success).toBe(true);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          scheduledAt: futureDate.toISOString(),
        })
      );
    });

    it("should handle newsletter send errors", async () => {
      mockEmailsSend.mockResolvedValue({
        data: null,
        error: { message: "Newsletter send failed" },
      });

      const post = createMockNewsletter();

      const { sendNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "PUBLISHED",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: { status: "PUBLISHED" },
        markdown: "# Content",
      });

      expect(result.error).toBe("Something went wrong!");
    });
  });

  describe("sendBroadcastNewsletter", () => {
    it("should create and send broadcast", async () => {
      const post = createMockNewsletter({ title: "Broadcast Newsletter" });

      const { sendBroadcastNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendBroadcastNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "PUBLISHED",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: { status: "PUBLISHED" },
        markdown: "# Broadcast Content",
      });

      expect(result.success).toBe(true);
      expect(mockBroadcastsCreate).toHaveBeenCalled();
      expect(mockBroadcastsSend).toHaveBeenCalled();
    });

    it("should handle broadcast create errors", async () => {
      mockBroadcastsCreate.mockResolvedValue({
        data: null,
        error: { message: "Broadcast create failed" },
      });

      const post = createMockNewsletter();

      const { sendBroadcastNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendBroadcastNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "PUBLISHED",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: { status: "PUBLISHED" },
        markdown: "# Content",
      });

      expect(result.error).toBe("Failed to create broadcast");
    });

    it("should handle broadcast send errors", async () => {
      mockBroadcastsSend.mockResolvedValue({
        data: null,
        error: { message: "Broadcast send failed" },
      });

      const post = createMockNewsletter();

      const { sendBroadcastNewsletter } = await import("@repo/actions/common/resend");

      const result = await sendBroadcastNewsletter({
        post: {
          id: post.id,
          title: post.title,
          postUrl: post.postUrl,
          content: post.content,
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "PUBLISHED",
          tags: [],
          author: { name: "Test Author" },
        },
        sendData: { status: "PUBLISHED" },
        markdown: "# Content",
      });

      expect(result.error).toBe("Failed to send broadcast");
    });
  });

  describe("addContactToAudience", () => {
    it("should add contact to audience successfully", async () => {
      const { addContactToAudience } = await import("@repo/actions/common/resend");

      const result = await addContactToAudience({
        email: "newcontact@example.com",
        firstName: "New",
        lastName: "Contact",
        unsubscribed: false,
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("contact-123");
      expect(mockContactsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "newcontact@example.com",
          firstName: "New",
          lastName: "Contact",
          audienceId: "test-audience-id",
          unsubscribed: false,
        })
      );
    });

    it("should handle contact create errors", async () => {
      mockContactsCreate.mockResolvedValue({
        data: null,
        error: { message: "Contact create failed" },
      });

      const { addContactToAudience } = await import("@repo/actions/common/resend");

      const result = await addContactToAudience({
        email: "error@example.com",
        firstName: "Error",
        lastName: "Test",
        unsubscribed: false,
      });

      expect(result.error).toBe("Something went wrong!");
    });
  });

  describe("updateContactAudience", () => {
    it("should update contact in audience", async () => {
      const { updateContactAudience } = await import("@repo/actions/common/resend");

      await updateContactAudience({
        id: "contact-123",
        firstName: "Updated",
        lastName: "Name",
        unsubscribed: true,
      });

      expect(mockContactsUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "contact-123",
          firstName: "Updated",
          lastName: "Name",
          unsubscribed: true,
        })
      );
    });
  });

  describe("deleteContactAudience", () => {
    it("should delete contact from audience", async () => {
      const { deleteContactAudience } = await import("@repo/actions/common/resend");

      const result = await deleteContactAudience("contact-123");

      expect(result.success).toBe(true);
      expect(mockContactsGet).toHaveBeenCalled();
      expect(mockContactsRemove).toHaveBeenCalled();
    });

    it("should handle delete errors gracefully", async () => {
      mockContactsGet.mockRejectedValue(new Error("Contact not found"));

      const { deleteContactAudience } = await import("@repo/actions/common/resend");

      const result = await deleteContactAudience("non-existent");

      expect(result.error).toBe("Failed to delete contact audience");
    });
  });
});
