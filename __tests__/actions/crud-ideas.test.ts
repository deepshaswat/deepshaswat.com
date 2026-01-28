import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma client - needs to be defined before vi.mock
vi.mock("@repo/db/client", () => ({
  default: {
    idea: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    post: {
      create: vi.fn(),
    },
  },
}));

// Import the mocked module
import prisma from "@repo/db/client";

// Cast to mocked type for type safety
const mockPrisma = prisma as unknown as {
  idea: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  post: {
    create: ReturnType<typeof vi.fn>;
  };
};

// Import after mocking
import {
  createIdea,
  fetchIdeas,
  fetchIdeaById,
  updateIdea,
  deleteIdea,
  convertIdeaToDraft,
  fetchIdeasCount,
} from "@repo/actions/admin/crud-ideas";

describe("Ideas CRUD Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createIdea", () => {
    it("should create an idea with required fields", async () => {
      const mockIdea = {
        id: "idea-1",
        title: "Test Idea",
        description: null,
        topics: [],
        status: "NEW",
        authorId: "author-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: "author-1", name: "Test Author", email: "test@example.com", imageUrl: null },
      };

      mockPrisma.idea.create.mockResolvedValue(mockIdea);

      const result = await createIdea({
        title: "Test Idea",
        authorId: "author-1",
      });

      expect(mockPrisma.idea.create).toHaveBeenCalledWith({
        data: {
          title: "Test Idea",
          description: null,
          topics: [],
          authorId: "author-1",
          status: "NEW",
        },
        include: {
          author: true,
        },
      });
      expect(result).toEqual(mockIdea);
    });

    it("should create an idea with all optional fields", async () => {
      const mockIdea = {
        id: "idea-2",
        title: "Full Idea",
        description: "A detailed description",
        topics: ["javascript", "react"],
        status: "NEW",
        authorId: "author-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: "author-1", name: "Test Author", email: "test@example.com", imageUrl: null },
      };

      mockPrisma.idea.create.mockResolvedValue(mockIdea);

      const result = await createIdea({
        title: "Full Idea",
        description: "A detailed description",
        topics: ["javascript", "react"],
        authorId: "author-1",
      });

      expect(mockPrisma.idea.create).toHaveBeenCalledWith({
        data: {
          title: "Full Idea",
          description: "A detailed description",
          topics: ["javascript", "react"],
          authorId: "author-1",
          status: "NEW",
        },
        include: {
          author: true,
        },
      });
      expect(result.topics).toEqual(["javascript", "react"]);
    });
  });

  describe("fetchIdeas", () => {
    it("should fetch all ideas when no status provided", async () => {
      const mockIdeas = [
        { id: "idea-1", title: "Idea 1", status: "NEW" },
        { id: "idea-2", title: "Idea 2", status: "IN_PROGRESS" },
      ];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);

      const result = await fetchIdeas();

      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          author: true,
          createdPost: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockIdeas);
    });

    it("should fetch ideas filtered by status", async () => {
      const mockIdeas = [{ id: "idea-1", title: "Idea 1", status: "NEW" }];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);

      const result = await fetchIdeas("NEW");

      expect(mockPrisma.idea.findMany).toHaveBeenCalledWith({
        where: { status: "NEW" },
        include: {
          author: true,
          createdPost: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("NEW");
    });

    it("should return empty array when no ideas found", async () => {
      mockPrisma.idea.findMany.mockResolvedValue([]);

      const result = await fetchIdeas("ARCHIVED");

      expect(result).toEqual([]);
    });
  });

  describe("fetchIdeaById", () => {
    it("should fetch a single idea by id", async () => {
      const mockIdea = {
        id: "idea-1",
        title: "Test Idea",
        status: "NEW",
        author: { id: "author-1", name: "Test Author" },
      };

      mockPrisma.idea.findUnique.mockResolvedValue(mockIdea);

      const result = await fetchIdeaById("idea-1");

      expect(mockPrisma.idea.findUnique).toHaveBeenCalledWith({
        where: { id: "idea-1" },
        include: {
          author: true,
          createdPost: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
      expect(result).toEqual(mockIdea);
    });

    it("should return null when idea not found", async () => {
      mockPrisma.idea.findUnique.mockResolvedValue(null);

      const result = await fetchIdeaById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updateIdea", () => {
    it("should update idea title", async () => {
      const mockUpdatedIdea = {
        id: "idea-1",
        title: "Updated Title",
        status: "NEW",
      };

      mockPrisma.idea.update.mockResolvedValue(mockUpdatedIdea);

      const result = await updateIdea("idea-1", { title: "Updated Title" });

      expect(mockPrisma.idea.update).toHaveBeenCalledWith({
        where: { id: "idea-1" },
        data: { title: "Updated Title" },
        include: {
          author: true,
          createdPost: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
      expect(result.title).toBe("Updated Title");
    });

    it("should update idea status", async () => {
      const mockUpdatedIdea = {
        id: "idea-1",
        title: "Test Idea",
        status: "IN_PROGRESS",
      };

      mockPrisma.idea.update.mockResolvedValue(mockUpdatedIdea);

      const result = await updateIdea("idea-1", { status: "IN_PROGRESS" });

      expect(result.status).toBe("IN_PROGRESS");
    });

    it("should update multiple fields at once", async () => {
      const mockUpdatedIdea = {
        id: "idea-1",
        title: "New Title",
        description: "New Description",
        topics: ["new-topic"],
        status: "IN_PROGRESS",
      };

      mockPrisma.idea.update.mockResolvedValue(mockUpdatedIdea);

      const result = await updateIdea("idea-1", {
        title: "New Title",
        description: "New Description",
        topics: ["new-topic"],
        status: "IN_PROGRESS",
      });

      expect(result).toEqual(mockUpdatedIdea);
    });
  });

  describe("deleteIdea", () => {
    it("should delete an idea", async () => {
      mockPrisma.idea.delete.mockResolvedValue({ id: "idea-1" });

      await deleteIdea("idea-1");

      expect(mockPrisma.idea.delete).toHaveBeenCalledWith({
        where: { id: "idea-1" },
      });
    });
  });

  describe("convertIdeaToDraft", () => {
    it("should convert idea to draft post", async () => {
      const mockIdea = {
        id: "idea-1",
        title: "My Blog Post Idea",
        description: "A great post about testing",
      };

      const mockPost = {
        id: "post-1",
        title: "My Blog Post Idea",
        status: "DRAFT",
      };

      mockPrisma.idea.findUnique.mockResolvedValue(mockIdea);
      mockPrisma.post.create.mockResolvedValue(mockPost);
      mockPrisma.idea.update.mockResolvedValue({
        ...mockIdea,
        status: "DRAFT_CREATED",
        createdPostId: "post-1",
      });

      const result = await convertIdeaToDraft("idea-1", "## Outline content", "author-1");

      expect(mockPrisma.idea.findUnique).toHaveBeenCalledWith({
        where: { id: "idea-1" },
      });
      expect(mockPrisma.post.create).toHaveBeenCalled();
      expect(mockPrisma.idea.update).toHaveBeenCalledWith({
        where: { id: "idea-1" },
        data: {
          status: "DRAFT_CREATED",
          createdPostId: "post-1",
        },
      });
      expect(result).toEqual({ postId: "post-1" });
    });

    it("should throw error when idea not found", async () => {
      mockPrisma.idea.findUnique.mockResolvedValue(null);

      await expect(convertIdeaToDraft("non-existent", "outline", "author-1")).rejects.toThrow(
        "Idea not found"
      );
    });

    it("should generate URL-safe postUrl from title", async () => {
      const mockIdea = {
        id: "idea-1",
        title: "My Amazing Blog Post! With Special Characters?",
        description: "Description",
      };

      mockPrisma.idea.findUnique.mockResolvedValue(mockIdea);
      mockPrisma.post.create.mockResolvedValue({ id: "post-1" });
      mockPrisma.idea.update.mockResolvedValue({ ...mockIdea, status: "DRAFT_CREATED" });

      await convertIdeaToDraft("idea-1", "outline", "author-1");

      const createCall = mockPrisma.post.create.mock.calls[0][0];
      expect(createCall.data.postUrl).toMatch(/^my-amazing-blog-post-with-special-characters-\d+$/);
    });
  });

  describe("fetchIdeasCount", () => {
    it("should count all ideas when no status provided", async () => {
      mockPrisma.idea.count.mockResolvedValue(10);

      const result = await fetchIdeasCount();

      expect(mockPrisma.idea.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toBe(10);
    });

    it("should count ideas by status", async () => {
      mockPrisma.idea.count.mockResolvedValue(5);

      const result = await fetchIdeasCount("NEW");

      expect(mockPrisma.idea.count).toHaveBeenCalledWith({ where: { status: "NEW" } });
      expect(result).toBe(5);
    });
  });
});
