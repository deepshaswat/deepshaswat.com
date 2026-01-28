import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMockPost,
  createMockPublishedPost,
  createMockScheduledPost,
  createMockNewsletter,
  resetPostCounter,
} from "../factories/post.factory";

// Mock dependencies
vi.mock("@clerk/nextjs", () => ({
  SignedIn: Promise.resolve(true),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@repo/ui/web", () => ({
  cacheService: {
    clearNewslettersCache: vi.fn(),
    clearArticlesCache: vi.fn(),
  },
}));

vi.mock("@repo/db/client", () => ({
  default: {
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tagOnPost: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../../packages/actions/src/common/resend", () => ({
  sendBroadcastNewsletter: vi.fn().mockResolvedValue({ success: true }),
  sendNewsletter: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../../packages/actions/src/web/redis-client", () => ({
  invalidatePostCache: vi.fn(),
  invalidateBlogContentCache: vi.fn(),
}));

import prisma from "@repo/db/client";
import { createPost, updatePost, publishPost } from "@repo/actions/admin/crud-posts";

const mockPrisma = prisma as unknown as {
  post: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  tagOnPost: {
    createMany: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe("Posts CRUD Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPostCounter();
  });

  describe("createPost", () => {
    it("should create a new post with required fields", async () => {
      const mockPost = createMockPost();
      mockPrisma.post.findUnique.mockResolvedValueOnce(null); // No existing post
      mockPrisma.post.create.mockResolvedValue(mockPost);
      mockPrisma.tagOnPost.createMany.mockResolvedValue({ count: 0 });
      mockPrisma.tagOnPost.findMany.mockResolvedValue([]);
      mockPrisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await createPost({
        title: "Test Post",
        content: "Test content",
        postUrl: "test-post",
        authorId: "author-1",
        tags: [],
        metaData: {
          title: null,
          description: null,
          imageUrl: null,
          keywords: null,
          authorName: null,
          canonicalUrl: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          twitterCard: null,
          twitterTitle: null,
          twitterDescription: null,
          twitterImage: null,
        },
      });

      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
    });

    it("should return error when post URL already exists", async () => {
      const existingPost = createMockPost({ postUrl: "existing-url" });
      mockPrisma.post.findUnique.mockResolvedValue(existingPost);

      const result = await createPost({
        title: "Test Post",
        content: "Test content",
        postUrl: "existing-url",
        authorId: "author-1",
        tags: [],
        metaData: {
          title: null,
          description: null,
          imageUrl: null,
          keywords: null,
          authorName: null,
          canonicalUrl: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          twitterCard: null,
          twitterTitle: null,
          twitterDescription: null,
          twitterImage: null,
        },
      });

      expect(result.error).toBe("Post URL already exists");
    });

    it("should create post with tags", async () => {
      const mockPost = createMockPost();
      mockPrisma.post.findUnique.mockResolvedValueOnce(null);
      mockPrisma.post.create.mockResolvedValue(mockPost);
      mockPrisma.tagOnPost.createMany.mockResolvedValue({ count: 2 });
      mockPrisma.tagOnPost.findMany.mockResolvedValue([
        { id: "top-1", tagId: "tag-1", postId: mockPost.id },
        { id: "top-2", tagId: "tag-2", postId: mockPost.id },
      ]);
      mockPrisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        tags: [{ id: "tag-1" }, { id: "tag-2" }],
      });

      const result = await createPost({
        title: "Test Post with Tags",
        content: "Test content",
        postUrl: "test-post-tags",
        authorId: "author-1",
        tags: [{ id: "tag-1", slug: "tag-1" }, { id: "tag-2", slug: "tag-2" }],
        metaData: {
          title: null,
          description: null,
          imageUrl: null,
          keywords: null,
          authorName: null,
          canonicalUrl: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          twitterCard: null,
          twitterTitle: null,
          twitterDescription: null,
          twitterImage: null,
        },
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.tagOnPost.createMany).toHaveBeenCalled();
    });

    it("should handle create errors gracefully", async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);
      mockPrisma.post.create.mockRejectedValue(new Error("Database error"));

      const result = await createPost({
        title: "Test Post",
        content: "Test content",
        postUrl: "test-post-error",
        authorId: "author-1",
        tags: [],
        metaData: {
          title: null,
          description: null,
          imageUrl: null,
          keywords: null,
          authorName: null,
          canonicalUrl: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          twitterCard: null,
          twitterTitle: null,
          twitterDescription: null,
          twitterImage: null,
        },
      });

      expect(result.error).toBe("Error creating post");
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      const mockPost = createMockPost();
      mockPrisma.post.findUnique.mockResolvedValueOnce(null); // No URL conflict
      mockPrisma.tagOnPost.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.post.update.mockResolvedValue(mockPost);
      mockPrisma.tagOnPost.createMany.mockResolvedValue({ count: 0 });
      mockPrisma.tagOnPost.findMany.mockResolvedValue([]);
      mockPrisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await updatePost(
        {
          title: "Updated Title",
          content: "Updated content",
          postUrl: "updated-post",
          authorId: "author-1",
          tags: [],
          metaData: {
            title: null,
            description: null,
            imageUrl: null,
            keywords: null,
            authorName: null,
            canonicalUrl: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
            twitterCard: null,
            twitterTitle: null,
            twitterDescription: null,
            twitterImage: null,
          },
        },
        "post-1"
      );

      expect(result.success).toBe(true);
    });

    it("should return error when updating to existing URL", async () => {
      const existingPost = createMockPost({ id: "different-post", postUrl: "existing-url" });
      mockPrisma.post.findUnique.mockResolvedValue(existingPost);

      const result = await updatePost(
        {
          title: "Updated Title",
          content: "Updated content",
          postUrl: "existing-url",
          authorId: "author-1",
          tags: [],
          metaData: {
            title: null,
            description: null,
            imageUrl: null,
            keywords: null,
            authorName: null,
            canonicalUrl: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
            twitterCard: null,
            twitterTitle: null,
            twitterDescription: null,
            twitterImage: null,
          },
        },
        "post-1"
      );

      expect(result.error).toBe("Post URL already exists");
    });

    it("should update tags when provided", async () => {
      const mockPost = createMockPost();
      mockPrisma.post.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tagOnPost.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.post.update.mockResolvedValue(mockPost);
      mockPrisma.tagOnPost.createMany.mockResolvedValue({ count: 2 });
      mockPrisma.tagOnPost.findMany.mockResolvedValue([]);
      mockPrisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await updatePost(
        {
          title: "Updated Title",
          content: "Updated content",
          postUrl: "updated-post",
          authorId: "author-1",
          tags: [{ id: "tag-1", slug: "new-tag" }],
          metaData: {
            title: null,
            description: null,
            imageUrl: null,
            keywords: null,
            authorName: null,
            canonicalUrl: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
            twitterCard: null,
            twitterTitle: null,
            twitterDescription: null,
            twitterImage: null,
          },
        },
        "post-1"
      );

      expect(mockPrisma.tagOnPost.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.tagOnPost.createMany).toHaveBeenCalled();
    });
  });

  describe("publishPost", () => {
    it("should publish a blog post immediately", async () => {
      const mockPost = createMockPublishedPost();
      mockPrisma.post.update.mockResolvedValue(mockPost);

      const result = await publishPost(
        "post-1",
        new Date(),
        "now",
        "blog",
        {
          id: "post-1",
          title: "Test Post",
          postUrl: "test-post",
          content: "Content",
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Author" },
        },
        "# Markdown content"
      );

      expect(result.success).toBe(true);
      expect(mockPrisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "post-1" },
          data: expect.objectContaining({
            status: "PUBLISHED",
          }),
        })
      );
    });

    it("should schedule a blog post for later", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const mockPost = createMockScheduledPost(futureDate);
      mockPrisma.post.update.mockResolvedValue(mockPost);

      const result = await publishPost(
        "post-1",
        futureDate,
        "later",
        "blog",
        {
          id: "post-1",
          title: "Test Post",
          postUrl: "test-post",
          content: "Content",
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Author" },
        },
        "# Markdown content"
      );

      expect(result.success).toBe(true);
      expect(mockPrisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "SCHEDULED",
            publishDate: futureDate,
          }),
        })
      );
    });

    it("should publish newsletter and send broadcast", async () => {
      const mockPost = createMockNewsletter();
      mockPrisma.post.update.mockResolvedValue(mockPost);

      const result = await publishPost(
        "post-1",
        new Date(),
        "now",
        "newsletter",
        {
          id: "post-1",
          title: "Test Newsletter",
          postUrl: "test-newsletter",
          content: "Content",
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Author" },
        },
        "# Newsletter content"
      );

      expect(result.success).toBe(true);
      expect(mockPrisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "PUBLISHED",
            isNewsletter: true,
          }),
        })
      );
    });

    it("should schedule newsletter for later", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);

      const mockPost = createMockScheduledPost(futureDate, { isNewsletter: true });
      mockPrisma.post.update.mockResolvedValue(mockPost);

      const result = await publishPost(
        "post-1",
        futureDate,
        "later",
        "newsletter",
        {
          id: "post-1",
          title: "Test Newsletter",
          postUrl: "test-newsletter",
          content: "Content",
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Author" },
        },
        "# Newsletter content"
      );

      expect(result.success).toBe(true);
      expect(mockPrisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "SCHEDULED",
            isNewsletter: true,
            publishDate: futureDate,
          }),
        })
      );
    });

    it("should handle publish errors gracefully", async () => {
      mockPrisma.post.update.mockRejectedValue(new Error("Database error"));

      const result = await publishPost(
        "post-1",
        new Date(),
        "now",
        "blog",
        {
          id: "post-1",
          title: "Test Post",
          postUrl: "test-post",
          content: "Content",
          featureImage: null,
          publishDate: null,
          excerpt: null,
          featured: false,
          status: "DRAFT",
          tags: [],
          author: { name: "Author" },
        },
        "# Markdown content"
      );

      expect(result.error).toBe("Error publishing post");
    });
  });
});
