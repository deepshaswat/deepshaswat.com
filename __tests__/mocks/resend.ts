import { vi } from "vitest";

/**
 * Mock Resend SDK for testing
 */

export const mockResendEmailsSend = vi.fn().mockResolvedValue({
  data: { id: "mock-email-id-123" },
  error: null,
});

export const mockResendBroadcastsCreate = vi.fn().mockResolvedValue({
  data: { id: "mock-broadcast-id-123" },
  error: null,
});

export const mockResendBroadcastsSend = vi.fn().mockResolvedValue({
  data: { id: "mock-broadcast-send-id-123" },
  error: null,
});

export const mockResendContactsCreate = vi.fn().mockResolvedValue({
  data: { id: "mock-contact-id-123" },
  error: null,
});

export const mockResendContactsUpdate = vi.fn().mockResolvedValue({
  data: { id: "mock-contact-id-123" },
  error: null,
});

export const mockResendContactsRemove = vi.fn().mockResolvedValue({
  data: { deleted: true },
  error: null,
});

export const mockResendContactsGet = vi.fn().mockResolvedValue({
  data: { id: "mock-contact-id-123", email: "test@example.com" },
  error: null,
});

export const mockResendAudiencesGet = vi.fn().mockResolvedValue({
  data: { id: "mock-audience-id", name: "Test Audience" },
  error: null,
});

export const createMockResend = () => ({
  emails: {
    send: mockResendEmailsSend,
  },
  broadcasts: {
    create: mockResendBroadcastsCreate,
    send: mockResendBroadcastsSend,
  },
  contacts: {
    create: mockResendContactsCreate,
    update: mockResendContactsUpdate,
    remove: mockResendContactsRemove,
    get: mockResendContactsGet,
  },
  audiences: {
    get: mockResendAudiencesGet,
  },
});

export const resetAllResendMocks = () => {
  mockResendEmailsSend.mockClear();
  mockResendBroadcastsCreate.mockClear();
  mockResendBroadcastsSend.mockClear();
  mockResendContactsCreate.mockClear();
  mockResendContactsUpdate.mockClear();
  mockResendContactsRemove.mockClear();
  mockResendContactsGet.mockClear();
  mockResendAudiencesGet.mockClear();
};

// Mock the Resend class constructor
export const MockResend = vi.fn().mockImplementation(() => createMockResend());
