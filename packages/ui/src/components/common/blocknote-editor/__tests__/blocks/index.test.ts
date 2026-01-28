import { describe, it, expect, vi } from "vitest";

// Mock the individual blocks
vi.mock("../../blocks/divider", () => ({
  Divider: { type: "divider", config: { type: "divider" } },
}));

vi.mock("../../blocks/youtube", () => ({
  Youtube: { type: "youtube", config: { type: "youtube" } },
}));

vi.mock("../../blocks/callout", () => ({
  Callout: { type: "callout", config: { type: "callout" } },
}));

vi.mock("../../blocks/markdown", () => ({
  Markdown: { type: "markdown", config: { type: "markdown" } },
}));

describe("Blocks Index Exports", () => {
  it("should export Divider", async () => {
    const { Divider } = await import("../../blocks/index");
    expect(Divider).toBeDefined();
    expect(Divider.type).toBe("divider");
  });

  it("should export Youtube", async () => {
    const { Youtube } = await import("../../blocks/index");
    expect(Youtube).toBeDefined();
    expect(Youtube.type).toBe("youtube");
  });

  it("should export Callout", async () => {
    const { Callout } = await import("../../blocks/index");
    expect(Callout).toBeDefined();
    expect(Callout.type).toBe("callout");
  });

  it("should export Markdown", async () => {
    const { Markdown } = await import("../../blocks/index");
    expect(Markdown).toBeDefined();
    expect(Markdown.type).toBe("markdown");
  });

  it("should export all blocks", async () => {
    const blocks = await import("../../blocks/index");
    expect(Object.keys(blocks)).toEqual(
      expect.arrayContaining(["Divider", "Youtube", "Callout", "Markdown"]),
    );
  });
});
