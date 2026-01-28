import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import React from "react";

// Use vi.hoisted for mock variables
const { mockEditor } = vi.hoisted(() => ({
  mockEditor: {
    topLevelBlocks: [] as any[],
    blocksToMarkdownLossy: vi.fn(async () => "Default markdown content"),
  },
}));

vi.mock("@blocknote/react", () => ({
  useCreateBlockNote: vi.fn(() => mockEditor),
}));

// Mock schema
vi.mock("../schema", () => ({
  blocknoteSchema: {
    BlockNoteEditor: {},
  },
}));

import { NewsletterMarkdown, useNewsletterMarkdown } from "../email-converter";

describe("NewsletterMarkdown Component", () => {
  const mockOnMarkdownChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockEditor.topLevelBlocks = [];
  });

  describe("rendering", () => {
    it("should render nothing (returns null)", () => {
      const { container } = render(
        <NewsletterMarkdown
          content="[]"
          onMarkdownChange={mockOnMarkdownChange}
        />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("content parsing", () => {
    it("should parse string content", () => {
      const content = JSON.stringify([{ type: "paragraph", props: {} }]);
      render(
        <NewsletterMarkdown
          content={content}
          onMarkdownChange={mockOnMarkdownChange}
        />,
      );
    });

    it("should handle object content", () => {
      render(
        <NewsletterMarkdown
          content={[{ type: "paragraph" }] as any}
          onMarkdownChange={mockOnMarkdownChange}
        />,
      );
    });

    it("should handle invalid JSON gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      render(
        <NewsletterMarkdown
          content="invalid json"
          onMarkdownChange={mockOnMarkdownChange}
        />,
      );
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("markdown conversion", () => {
    it("should call onMarkdownChange with converted content", async () => {
      mockEditor.topLevelBlocks = [];
      render(
        <NewsletterMarkdown
          content="[]"
          onMarkdownChange={mockOnMarkdownChange}
        />,
      );

      await waitFor(() => {
        expect(mockOnMarkdownChange).toHaveBeenCalled();
      });
    });

    it("should work without onMarkdownChange callback", () => {
      render(<NewsletterMarkdown content="[]" />);
    });
  });
});

describe("useNewsletterMarkdown Hook", () => {
  beforeEach(() => {
    mockEditor.topLevelBlocks = [];
  });

  it("should return markdown state and component", () => {
    const TestComponent = () => {
      const { markdown, NewsletterMarkdown: Component } =
        useNewsletterMarkdown("[]");
      return (
        <div>
          <span data-testid="markdown">{markdown}</span>
          <Component />
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("markdown")).toBeInTheDocument();
  });

  it("should initialize markdown as empty string", () => {
    const TestComponent = () => {
      const { markdown } = useNewsletterMarkdown("[]");
      return <span data-testid="markdown">{markdown || "empty"}</span>;
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("markdown")).toHaveTextContent("empty");
  });
});

describe("Block Type Conversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEditor.blocksToMarkdownLossy.mockReset();
  });

  describe("youtube block", () => {
    it("should convert youtube block to thumbnail HTML", async () => {
      const youtubeBlock = [
        {
          type: "youtube",
          props: { url: "https://www.youtube.com/embed/testId123" },
        },
      ];
      mockEditor.topLevelBlocks = youtubeBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(youtubeBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("youtube.com");
        expect(capturedMarkdown).toContain("testId123");
      });
    });
  });

  describe("video block", () => {
    it("should convert video block to clickable placeholder", async () => {
      const videoBlock = [
        {
          type: "video",
          props: { url: "https://example.com/video.mp4", caption: "My Video" },
        },
      ];
      mockEditor.topLevelBlocks = videoBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(videoBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("Click to watch video");
        expect(capturedMarkdown).toContain("My Video");
      });
    });

    it("should convert video block without caption", async () => {
      const videoBlock = [
        {
          type: "video",
          props: { url: "https://example.com/video.mp4" },
        },
      ];
      mockEditor.topLevelBlocks = videoBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(videoBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("Click to watch video");
      });
    });
  });

  describe("callout block", () => {
    it("should convert callout block with emoji", async () => {
      const calloutBlock = [
        {
          type: "callout",
          props: {
            text: "Important note",
            emoji: "⚠️",
            bgColor: "#FF0000",
            textColor: "#FFFFFF",
            showEmoji: true,
          },
        },
      ];
      mockEditor.topLevelBlocks = calloutBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(calloutBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("Important note");
        expect(capturedMarkdown).toContain("⚠️");
      });
    });

    it("should convert callout block without emoji", async () => {
      const calloutBlock = [
        {
          type: "callout",
          props: {
            text: "No emoji note",
            emoji: "",
            bgColor: "#333",
            textColor: "#FFF",
            showEmoji: false,
          },
        },
      ];
      mockEditor.topLevelBlocks = calloutBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(calloutBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("No emoji note");
        expect(capturedMarkdown).not.toContain("margin-right: 8px");
      });
    });
  });

  describe("divider block", () => {
    it("should convert divider to hr tag", async () => {
      const dividerBlock = [{ type: "divider", props: {} }];
      mockEditor.topLevelBlocks = dividerBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(dividerBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("<hr");
      });
    });
  });

  describe("markdown block", () => {
    it("should convert markdown block to code fence", async () => {
      const markdownBlock = [
        {
          type: "markdown",
          props: { content: "# Hello" },
        },
      ];
      mockEditor.topLevelBlocks = markdownBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(markdownBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("```markdown");
        expect(capturedMarkdown).toContain("# Hello");
      });
    });

    it("should handle markdown block with empty content", async () => {
      const markdownBlock = [
        {
          type: "markdown",
          props: { content: "" },
        },
      ];
      mockEditor.topLevelBlocks = markdownBlock;

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(markdownBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("```markdown");
      });
    });
  });

  describe("table block", () => {
    it("should convert table block to HTML table", async () => {
      const tableBlock = [{ type: "table", props: {} }];
      mockEditor.topLevelBlocks = tableBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue(
        "| Col1 | Col2 |\n| --- | --- |\n| A | B |",
      );

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(tableBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("<table");
        expect(capturedMarkdown).toContain("<tr>");
        expect(capturedMarkdown).toContain("<td");
      });
    });

    it("should handle table with empty rows", async () => {
      const tableBlock = [{ type: "table", props: {} }];
      mockEditor.topLevelBlocks = tableBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue("| | |\n| --- |\n");

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(tableBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("<table");
      });
    });
  });

  describe("default blocks", () => {
    it("should handle default block with center alignment", async () => {
      const paragraphBlock = [
        {
          type: "paragraph",
          props: {
            textAlignment: "center",
            backgroundColor: "default",
            textColor: "default",
          },
        },
      ];
      mockEditor.topLevelBlocks = paragraphBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue("Centered text");

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(paragraphBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("text-align: center");
      });
    });

    it("should handle default block with custom colors", async () => {
      const paragraphBlock = [
        {
          type: "paragraph",
          props: {
            textAlignment: "left",
            backgroundColor: "#FF0000",
            textColor: "#00FF00",
          },
        },
      ];
      mockEditor.topLevelBlocks = paragraphBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue("Colored text");

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(paragraphBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("background-color: #FF0000");
        expect(capturedMarkdown).toContain("color: #00FF00");
      });
    });

    it("should handle quote blocks (paragraph starting with >)", async () => {
      const quoteBlock = [
        {
          type: "paragraph",
          props: {
            textAlignment: "left",
            backgroundColor: "default",
            textColor: "default",
          },
        },
      ];
      mockEditor.topLevelBlocks = quoteBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue("> This is a quote");

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(quoteBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("border-left: 4px solid");
        expect(capturedMarkdown).toContain("font-style: italic");
      });
    });

    it("should handle code blocks in default markdown", async () => {
      const codeBlock = [
        {
          type: "paragraph",
          props: {
            textAlignment: "left",
            backgroundColor: "default",
            textColor: "default",
          },
        },
      ];
      mockEditor.topLevelBlocks = codeBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue(
        "```javascript\nconst x = 1;\n```",
      );

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(codeBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("<pre");
        expect(capturedMarkdown).toContain("font-family: monospace");
      });
    });

    it("should handle default block with no special alignment", async () => {
      const paragraphBlock = [
        {
          type: "heading",
          props: {},
        },
      ];
      mockEditor.topLevelBlocks = paragraphBlock;
      mockEditor.blocksToMarkdownLossy.mockResolvedValue("Simple heading");

      let capturedMarkdown = "";
      render(
        <NewsletterMarkdown
          content={JSON.stringify(paragraphBlock)}
          onMarkdownChange={(md) => {
            capturedMarkdown = md;
          }}
        />,
      );

      await waitFor(() => {
        expect(capturedMarkdown).toContain("Simple heading");
        expect(capturedMarkdown).toContain("color: #ffffff");
      });
    });
  });
});
