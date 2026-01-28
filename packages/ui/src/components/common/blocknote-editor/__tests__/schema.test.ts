import { describe, it, expect, vi } from "vitest";

// Mock BlockNote core
vi.mock("@blocknote/core", () => ({
  BlockNoteSchema: {
    create: vi.fn((config) => ({
      ...config,
      BlockNoteEditor: {},
    })),
  },
  defaultBlockSpecs: {
    paragraph: {},
    heading: {},
    bulletListItem: {},
    numberedListItem: {},
    checkListItem: {},
    image: {},
    video: {},
    file: {},
    audio: {},
    table: {},
    codeBlock: {},
  },
}));

// Mock blocks
vi.mock("../blocks", () => ({
  Divider: { type: "divider" },
  Youtube: { type: "youtube" },
  Callout: { type: "callout" },
  Markdown: { type: "markdown" },
}));

import { blocknoteSchema, BlockNoteEditorType } from "../schema";
import { BlockNoteSchema } from "@blocknote/core";

describe("BlockNote Schema", () => {
  describe("schema creation", () => {
    it("should call BlockNoteSchema.create", () => {
      expect(BlockNoteSchema.create).toHaveBeenCalled();
    });

    it("should include default block specs", () => {
      const createCall = vi.mocked(BlockNoteSchema.create).mock.calls[0][0];
      expect(createCall.blockSpecs).toHaveProperty("paragraph");
      expect(createCall.blockSpecs).toHaveProperty("heading");
      expect(createCall.blockSpecs).toHaveProperty("bulletListItem");
    });

    it("should include custom youtube block", () => {
      const createCall = vi.mocked(BlockNoteSchema.create).mock.calls[0][0];
      expect(createCall.blockSpecs).toHaveProperty("youtube");
    });

    it("should include custom markdown block", () => {
      const createCall = vi.mocked(BlockNoteSchema.create).mock.calls[0][0];
      expect(createCall.blockSpecs).toHaveProperty("markdown");
    });

    it("should include custom callout block", () => {
      const createCall = vi.mocked(BlockNoteSchema.create).mock.calls[0][0];
      expect(createCall.blockSpecs).toHaveProperty("callout");
    });

    it("should include custom divider block", () => {
      const createCall = vi.mocked(BlockNoteSchema.create).mock.calls[0][0];
      expect(createCall.blockSpecs).toHaveProperty("divider");
    });
  });

  describe("schema export", () => {
    it("should export blocknoteSchema", () => {
      expect(blocknoteSchema).toBeDefined();
    });

    it("should have blockSpecs property", () => {
      expect(blocknoteSchema.blockSpecs).toBeDefined();
    });
  });

  describe("type export", () => {
    it("should export BlockNoteEditorType", () => {
      // Type check - this will fail at compile time if type is not exported
      const typeCheck: BlockNoteEditorType = blocknoteSchema.BlockNoteEditor;
      expect(typeCheck).toBeDefined();
    });
  });
});
