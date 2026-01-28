/**
 * Factory for creating mock Email Event webhook payloads
 */

export interface MockWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at?: string;
    click?: {
      link: string;
      timestamp: string;
    };
  };
}

export interface MockEmailSend {
  id: string;
  resendEmailId: string;
  broadcastId: string | null;
  postId: string | null;
  subject: string;
  fromEmail: string;
  sentAt: Date;
  status: string;
  deliveredAt: Date | null;
  openedAt: Date | null;
  clickedAt: Date | null;
  bouncedAt: Date | null;
  lastEventAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockEmailRecipient {
  id: string;
  emailSendId: string;
  memberId: string | null;
  email: string;
  delivered: boolean;
  opened: boolean;
  openCount: number;
  clicked: boolean;
  clickCount: number;
  bounced: boolean;
  firstOpenedAt: Date | null;
  lastOpenedAt: Date | null;
}

export interface MockEmailEvent {
  id: string;
  emailSendId: string;
  eventType: string;
  eventId: string;
  recipientEmail: string | null;
  linkUrl: string | null;
  rawPayload: string;
  processedAt: Date;
}

let eventIdCounter = 1;

export function createMockWebhookPayload(
  eventType: string,
  overrides: Partial<MockWebhookPayload> = {}
): MockWebhookPayload {
  const now = new Date().toISOString();

  return {
    type: eventType,
    created_at: now,
    data: {
      email_id: `email-${eventIdCounter++}`,
      from: "test@example.com",
      to: ["recipient@example.com"],
      subject: "Test Email Subject",
      created_at: now,
      ...overrides.data,
    },
    ...overrides,
  };
}

export function createDeliveredPayload(
  emailId: string,
  recipient: string
): MockWebhookPayload {
  return createMockWebhookPayload("email.delivered", {
    data: {
      email_id: emailId,
      from: "sender@example.com",
      to: [recipient],
      subject: "Test Subject",
    },
  });
}

export function createOpenedPayload(
  emailId: string,
  recipient: string
): MockWebhookPayload {
  return createMockWebhookPayload("email.opened", {
    data: {
      email_id: emailId,
      from: "sender@example.com",
      to: [recipient],
      subject: "Test Subject",
    },
  });
}

export function createClickedPayload(
  emailId: string,
  recipient: string,
  link: string
): MockWebhookPayload {
  const now = new Date().toISOString();

  return createMockWebhookPayload("email.clicked", {
    data: {
      email_id: emailId,
      from: "sender@example.com",
      to: [recipient],
      subject: "Test Subject",
      click: {
        link,
        timestamp: now,
      },
    },
  });
}

export function createBouncedPayload(
  emailId: string,
  recipient: string
): MockWebhookPayload {
  return createMockWebhookPayload("email.bounced", {
    data: {
      email_id: emailId,
      from: "sender@example.com",
      to: [recipient],
      subject: "Test Subject",
    },
  });
}

export function createComplainedPayload(
  emailId: string,
  recipient: string
): MockWebhookPayload {
  return createMockWebhookPayload("email.complained", {
    data: {
      email_id: emailId,
      from: "sender@example.com",
      to: [recipient],
      subject: "Test Subject",
    },
  });
}

export function createMockEmailSend(
  overrides: Partial<MockEmailSend> = {}
): MockEmailSend {
  const id = overrides.id || `email-send-${eventIdCounter++}`;
  const now = new Date();

  return {
    id,
    resendEmailId: `resend-${id}`,
    broadcastId: null,
    postId: null,
    subject: "Test Newsletter",
    fromEmail: "sender@example.com",
    sentAt: now,
    status: "SENT",
    deliveredAt: null,
    openedAt: null,
    clickedAt: null,
    bouncedAt: null,
    lastEventAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createMockEmailRecipient(
  emailSendId: string,
  email: string,
  overrides: Partial<MockEmailRecipient> = {}
): MockEmailRecipient {
  const id = `recipient-${eventIdCounter++}`;

  return {
    id,
    emailSendId,
    memberId: null,
    email,
    delivered: false,
    opened: false,
    openCount: 0,
    clicked: false,
    clickCount: 0,
    bounced: false,
    firstOpenedAt: null,
    lastOpenedAt: null,
    ...overrides,
  };
}

export function createMockEmailEvent(
  emailSendId: string,
  eventType: string,
  overrides: Partial<MockEmailEvent> = {}
): MockEmailEvent {
  const id = `event-${eventIdCounter++}`;
  const now = new Date();

  return {
    id,
    emailSendId,
    eventType,
    eventId: `svix-${id}`,
    recipientEmail: null,
    linkUrl: null,
    rawPayload: JSON.stringify({ type: eventType }),
    processedAt: now,
    ...overrides,
  };
}

export function resetEventCounter(): void {
  eventIdCounter = 1;
}
