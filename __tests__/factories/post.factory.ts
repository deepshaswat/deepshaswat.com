/**
 * Factory for creating mock Post objects
 */

export interface MockPost {
  id: string;
  title: string;
  content: string;
  featureImage: string | null;
  postUrl: string;
  publishDate: Date | null;
  excerpt: string | null;
  authorId: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "DELETED";
  isNewsletter: boolean;
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  uniqueOpens: number;
  metadataTitle: string | null;
  metadataDescription: string | null;
  metadataImageUrl: string | null;
  metadataKeywords: string | null;
  metadataAuthorName: string | null;
  metadataCanonicalUrl: string | null;
  metadataOgTitle: string | null;
  metadataOgDescription: string | null;
  metadataOgImage: string | null;
  metadataTwitterCard: string | null;
  metadataTwitterTitle: string | null;
  metadataTwitterDescription: string | null;
  metadataTwitterImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{ id: string; tagId: string; postId: string }>;
  author?: { id: string; name: string; email: string; imageUrl: string | null };
}

let postIdCounter = 1;

export function createMockPost(overrides: Partial<MockPost> = {}): MockPost {
  const id = overrides.id || `post-${postIdCounter++}`;
  const now = new Date();

  return {
    id,
    title: `Test Post ${id}`,
    content: JSON.stringify([{ type: "paragraph", content: "Test content" }]),
    featureImage: null,
    postUrl: `test-post-${id}`,
    publishDate: null,
    excerpt: "Test excerpt",
    authorId: "author-1",
    featured: false,
    status: "DRAFT",
    isNewsletter: false,
    emailsSent: 0,
    emailsDelivered: 0,
    emailsOpened: 0,
    uniqueOpens: 0,
    metadataTitle: null,
    metadataDescription: null,
    metadataImageUrl: null,
    metadataKeywords: null,
    metadataAuthorName: null,
    metadataCanonicalUrl: null,
    metadataOgTitle: null,
    metadataOgDescription: null,
    metadataOgImage: null,
    metadataTwitterCard: null,
    metadataTwitterTitle: null,
    metadataTwitterDescription: null,
    metadataTwitterImage: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createMockPublishedPost(
  overrides: Partial<MockPost> = {}
): MockPost {
  return createMockPost({
    status: "PUBLISHED",
    publishDate: new Date(),
    ...overrides,
  });
}

export function createMockScheduledPost(
  scheduledDate: Date,
  overrides: Partial<MockPost> = {}
): MockPost {
  return createMockPost({
    status: "SCHEDULED",
    publishDate: scheduledDate,
    ...overrides,
  });
}

export function createMockNewsletter(
  overrides: Partial<MockPost> = {}
): MockPost {
  return createMockPost({
    isNewsletter: true,
    status: "PUBLISHED",
    publishDate: new Date(),
    emailsSent: 100,
    emailsDelivered: 95,
    emailsOpened: 45,
    uniqueOpens: 40,
    ...overrides,
  });
}

export function createMockPostWithAuthor(
  overrides: Partial<MockPost> = {}
): MockPost {
  return createMockPost({
    author: {
      id: "author-1",
      name: "Test Author",
      email: "author@example.com",
      imageUrl: null,
    },
    ...overrides,
  });
}

export function resetPostCounter(): void {
  postIdCounter = 1;
}
