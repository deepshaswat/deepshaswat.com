/**
 * Factory for creating mock Member objects
 */

export interface MockMember {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  note: string | null;
  unsubscribed: boolean;
  openRate: string | null;
  location: string | null;
  imageUrl: string | null;
  resendContactId: string | null;
  totalEmailsReceived: number;
  totalEmailsOpened: number;
  totalEmailsClicked: number;
  totalBounces: number;
  lastEmailOpenedAt: Date | null;
  engagementScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

let memberIdCounter = 1;

export function createMockMember(
  overrides: Partial<MockMember> = {}
): MockMember {
  const id = overrides.id || `member-${memberIdCounter++}`;
  const now = new Date();

  return {
    id,
    firstName: "Test",
    lastName: "Member",
    email: `test-${id}@example.com`,
    note: null,
    unsubscribed: false,
    openRate: null,
    location: null,
    imageUrl: null,
    resendContactId: `resend-contact-${id}`,
    totalEmailsReceived: 0,
    totalEmailsOpened: 0,
    totalEmailsClicked: 0,
    totalBounces: 0,
    lastEmailOpenedAt: null,
    engagementScore: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createMockActiveMember(
  overrides: Partial<MockMember> = {}
): MockMember {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  return createMockMember({
    totalEmailsReceived: 20,
    totalEmailsOpened: 15,
    totalEmailsClicked: 5,
    openRate: "75.0%",
    lastEmailOpenedAt: lastWeek,
    engagementScore: 85,
    ...overrides,
  });
}

export function createMockUnsubscribedMember(
  overrides: Partial<MockMember> = {}
): MockMember {
  return createMockMember({
    unsubscribed: true,
    ...overrides,
  });
}

export function createMockBouncedMember(
  overrides: Partial<MockMember> = {}
): MockMember {
  return createMockMember({
    totalEmailsReceived: 5,
    totalBounces: 3,
    engagementScore: 10,
    ...overrides,
  });
}

export function createMockInactiveMember(
  overrides: Partial<MockMember> = {}
): MockMember {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return createMockMember({
    totalEmailsReceived: 50,
    totalEmailsOpened: 5,
    totalEmailsClicked: 1,
    openRate: "10.0%",
    lastEmailOpenedAt: threeMonthsAgo,
    engagementScore: 15,
    ...overrides,
  });
}

export function resetMemberCounter(): void {
  memberIdCounter = 1;
}
