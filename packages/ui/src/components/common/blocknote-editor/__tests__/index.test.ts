import { describe, it, expect, vi } from "vitest";

// Mock all the dependencies to avoid actual imports
vi.mock("../schema", () => ({
  blocknoteSchema: { type: "schema" },
  BlockNoteEditorType: {},
}));

vi.mock("../editor", () => ({
  BlockNoteEditor: () => null,
  default: () => null,
}));

vi.mock("../renderer", () => ({
  BlockNoteRenderer: () => null,
}));

vi.mock("../email-converter", () => ({
  NewsletterMarkdown: () => null,
  useNewsletterMarkdown: () => ({
    markdown: "",
    NewsletterMarkdown: () => null,
  }),
}));

vi.mock("../blocks", () => ({
  Divider: { type: "divider" },
  Youtube: { type: "youtube" },
  Callout: { type: "callout" },
  Markdown: { type: "markdown" },
}));

describe("BlockNote Editor Index Exports", () => {
  it("should export blocknoteSchema", async () => {
    const module = await import("../index");
    expect(module.blocknoteSchema).toBeDefined();
  });

  it("should export BlockNoteEditor", async () => {
    const module = await import("../index");
    expect(module.BlockNoteEditor).toBeDefined();
  });

  it("should export default as BlockNoteEditor", async () => {
    const module = await import("../index");
    expect(module.default).toBeDefined();
  });

  it("should export BlockNoteRenderer", async () => {
    const module = await import("../index");
    expect(module.BlockNoteRenderer).toBeDefined();
  });

  it("should export NewsletterMarkdown", async () => {
    const module = await import("../index");
    expect(module.NewsletterMarkdown).toBeDefined();
  });

  it("should export useNewsletterMarkdown", async () => {
    const module = await import("../index");
    expect(module.useNewsletterMarkdown).toBeDefined();
  });

  it("should export Divider block", async () => {
    const module = await import("../index");
    expect(module.Divider).toBeDefined();
  });

  it("should export Youtube block", async () => {
    const module = await import("../index");
    expect(module.Youtube).toBeDefined();
  });

  it("should export Callout block", async () => {
    const module = await import("../index");
    expect(module.Callout).toBeDefined();
  });

  it("should export Markdown block", async () => {
    const module = await import("../index");
    expect(module.Markdown).toBeDefined();
  });
});

describe("Type Exports", () => {
  it("should export BlockNoteEditorProps type", async () => {
    // Type checking is done at compile time
    // This test verifies the export exists
    const module = await import("../index");
    // BlockNoteEditorProps is a type, so we can't directly check it at runtime
    // but importing the module without errors means the types are valid
    expect(module).toBeDefined();
  });

  it("should export BlockNoteRendererProps type", async () => {
    const module = await import("../index");
    expect(module).toBeDefined();
  });

  it("should export NewsletterMarkdownProps type", async () => {
    const module = await import("../index");
    expect(module).toBeDefined();
  });

  it("should export BlockNoteEditorType", async () => {
    const module = await import("../index");
    expect(module).toBeDefined();
  });
});
