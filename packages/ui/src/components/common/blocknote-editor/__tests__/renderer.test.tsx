import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: "dark" })),
}));

// Mock BlockNote
const mockEditor = {
  topLevelBlocks: [],
};

vi.mock("@blocknote/react", () => ({
  useCreateBlockNote: vi.fn(() => mockEditor),
}));

vi.mock("@blocknote/mantine", () => ({
  BlockNoteView: ({ editable, theme, className, editor }: any) => (
    <div
      data-testid="blocknote-view"
      data-editable={editable}
      data-theme={theme}
      className={className}
    >
      Rendered Content
    </div>
  ),
}));

// Mock schema
vi.mock("../schema", () => ({
  blocknoteSchema: {
    BlockNoteEditor: {},
  },
}));

import { BlockNoteRenderer } from "../renderer";
import { useTheme } from "next-themes";

describe("BlockNoteRenderer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({ resolvedTheme: "dark" } as any);
  });

  describe("rendering", () => {
    it("should render BlockNoteView", () => {
      render(<BlockNoteRenderer content="[]" />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });

    it("should set editable to false", () => {
      render(<BlockNoteRenderer content="[]" />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-editable", "false");
    });

    it("should apply custom className", () => {
      render(<BlockNoteRenderer content="[]" className="custom-class" />);
      const wrapper =
        screen.getByTestId("blocknote-view").parentElement?.parentElement
          ?.parentElement;
      expect(wrapper?.className).toContain("custom-class");
    });

    it("should render with default empty className", () => {
      const { container } = render(<BlockNoteRenderer content="[]" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("content parsing", () => {
    it("should parse string content", () => {
      const content = JSON.stringify([{ type: "paragraph", content: [] }]);
      render(<BlockNoteRenderer content={content} />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });

    it("should accept object content", () => {
      const content = [{ type: "paragraph", content: [] }];
      render(<BlockNoteRenderer content={content} />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });

    it("should handle invalid JSON gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      render(<BlockNoteRenderer content="invalid json" />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it("should fallback to empty array on parse error", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      render(<BlockNoteRenderer content="{invalid}" />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("theme handling", () => {
    it("should use dark theme when resolvedTheme is dark", () => {
      render(<BlockNoteRenderer content="[]" />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-theme", "dark");
    });

    it("should use light theme when resolvedTheme is light", () => {
      vi.mocked(useTheme).mockReturnValue({ resolvedTheme: "light" } as any);
      render(<BlockNoteRenderer content="[]" />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-theme", "light");
    });
  });

  describe("prose styling", () => {
    it("should have prose wrapper with styling classes", () => {
      const { container } = render(<BlockNoteRenderer content="[]" />);
      const proseDiv = container.querySelector(".prose");
      expect(proseDiv).toBeInTheDocument();
      expect(proseDiv).toHaveClass("prose-lg", "max-w-none");
    });
  });

  describe("global styles", () => {
    it("should include style tag with global styles", () => {
      const { container } = render(<BlockNoteRenderer content="[]" />);
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeInTheDocument();
    });
  });
});

describe("BlockNoteRenderer Export", () => {
  it("should export default BlockNoteRenderer", async () => {
    const module = await import("../renderer");
    expect(module.default).toBeDefined();
    expect(module.BlockNoteRenderer).toBeDefined();
    expect(module.default).toBe(module.BlockNoteRenderer);
  });
});
