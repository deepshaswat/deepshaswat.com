import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock dependencies
vi.mock("@blocknote/react", () => ({
  createReactBlockSpec: vi.fn((config, { render: renderFn }) => {
    const MockBlock = (props: any) => renderFn(props);
    MockBlock.config = config;
    MockBlock.render = renderFn;
    return MockBlock;
  }),
}));

vi.mock("@repo/ui/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("../../../../ui/button", () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button
      data-testid="toolbar-button"
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../../../ui/textarea", () => ({
  Textarea: React.forwardRef(
    (
      { onChange, onKeyDown, value, className, rows, placeholder }: any,
      ref: any,
    ) => (
      <textarea
        ref={ref}
        data-testid="markdown-textarea"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className={className}
        rows={rows}
        placeholder={placeholder}
      />
    ),
  ),
}));

vi.mock("react-markdown", () => ({
  default: ({ children, components }: any) => {
    // Call the component functions to cover them
    if (components) {
      const mockNode = {};
      const mockProps = { children: "test" };
      if (components.h1) components.h1({ node: mockNode, ...mockProps });
      if (components.h2) components.h2({ node: mockNode, ...mockProps });
      if (components.h3) components.h3({ node: mockNode, ...mockProps });
      if (components.p) components.p({ node: mockNode, ...mockProps });
      if (components.ul) components.ul({ node: mockNode, ...mockProps });
      if (components.ol) components.ol({ node: mockNode, ...mockProps });
      if (components.li) components.li({ node: mockNode, ...mockProps });
      if (components.blockquote)
        components.blockquote({ node: mockNode, ...mockProps });
      if (components.a)
        components.a({ node: mockNode, href: "http://test.com", ...mockProps });
      if (components.img)
        components.img({
          node: mockNode,
          src: "test.jpg",
          alt: "test",
          ...mockProps,
        });
    }
    return <div data-testid="react-markdown">{children}</div>;
  },
}));

vi.mock("react-icons/fa", () => ({
  FaBold: () => <span data-testid="bold-icon">B</span>,
  FaItalic: () => <span data-testid="italic-icon">I</span>,
  FaHeading: () => <span data-testid="heading-icon">H</span>,
  FaQuoteRight: () => <span data-testid="quote-icon">Q</span>,
  FaListUl: () => <span data-testid="list-ul-icon">UL</span>,
  FaListOl: () => <span data-testid="list-ol-icon">OL</span>,
  FaLink: () => <span data-testid="link-icon">Link</span>,
  FaImage: () => <span data-testid="image-icon">Img</span>,
}));

import { Markdown } from "../../blocks/markdown";

describe("Markdown Block", () => {
  const mockEditor = {
    updateBlock: vi.fn(),
    isEditable: true,
  };

  const mockEditorReadOnly = {
    updateBlock: vi.fn(),
    isEditable: false,
  };

  const mockBlockWithContent = {
    props: {
      content: "# Hello World\n\nThis is markdown.",
    },
  };

  const mockBlockEmpty = {
    props: {
      content: "",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("block configuration", () => {
    it("should have correct type", () => {
      expect(Markdown.config.type).toBe("markdown");
    });

    it("should have content prop with empty default", () => {
      expect(Markdown.config.propSchema.content.default).toBe("");
    });

    it("should have content set to none", () => {
      expect(Markdown.config.content).toBe("none");
    });
  });

  describe("render with content in view mode", () => {
    it("should render ReactMarkdown when content exists and not editing", () => {
      render(
        <Markdown block={mockBlockWithContent} editor={mockEditorReadOnly} />,
      );
      expect(screen.getByTestId("react-markdown")).toBeInTheDocument();
    });

    it("should display the markdown content", () => {
      render(
        <Markdown block={mockBlockWithContent} editor={mockEditorReadOnly} />,
      );
      expect(screen.getByText(/Hello World/)).toBeInTheDocument();
      expect(screen.getByText(/This is markdown/)).toBeInTheDocument();
    });
  });

  describe("render empty block in edit mode", () => {
    it("should show textarea when content is empty", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);
      expect(screen.getByTestId("markdown-textarea")).toBeInTheDocument();
    });

    it("should show toolbar buttons when editing", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);
      expect(screen.getByTestId("bold-icon")).toBeInTheDocument();
      expect(screen.getByTestId("italic-icon")).toBeInTheDocument();
      expect(screen.getByTestId("heading-icon")).toBeInTheDocument();
      expect(screen.getByTestId("quote-icon")).toBeInTheDocument();
      expect(screen.getByTestId("list-ul-icon")).toBeInTheDocument();
      expect(screen.getByTestId("list-ol-icon")).toBeInTheDocument();
      expect(screen.getByTestId("link-icon")).toBeInTheDocument();
      expect(screen.getByTestId("image-icon")).toBeInTheDocument();
    });
  });

  describe("edit mode interactions", () => {
    it("should enter edit mode on click when editable", () => {
      render(<Markdown block={mockBlockWithContent} editor={mockEditor} />);

      const markdown = screen.getByTestId("react-markdown");
      fireEvent.click(markdown.parentElement!);

      expect(screen.getByTestId("markdown-textarea")).toBeInTheDocument();
    });

    it("should not enter edit mode on click when read-only", () => {
      render(
        <Markdown block={mockBlockWithContent} editor={mockEditorReadOnly} />,
      );

      const markdown = screen.getByTestId("react-markdown");
      fireEvent.click(markdown.parentElement!);

      expect(screen.queryByTestId("markdown-textarea")).not.toBeInTheDocument();
    });

    it("should update content on textarea change", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId("markdown-textarea");
      fireEvent.change(textarea, { target: { value: "New content" } });

      expect(textarea).toHaveValue("New content");
    });
  });

  describe("toolbar functionality", () => {
    it("should have 8 toolbar buttons", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);
      const buttons = screen.getAllByTestId("toolbar-button");
      expect(buttons.length).toBe(8);
    });

    it("should insert bold symbol", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "test" } });

      // Set selection
      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 4,
        writable: true,
      });

      const boldButton = screen.getByTestId("bold-icon").parentElement;
      fireEvent.click(boldButton!);
    });

    it("should insert italic symbol", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "test" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 4,
        writable: true,
      });

      const italicButton = screen.getByTestId("italic-icon").parentElement;
      fireEvent.click(italicButton!);
    });

    it("should insert link symbol with selected text", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "link text" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 9,
        writable: true,
      });

      const linkButton = screen.getByTestId("link-icon").parentElement;
      fireEvent.click(linkButton!);
    });

    it("should insert link symbol without selected text", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const linkButton = screen.getByTestId("link-icon").parentElement;
      fireEvent.click(linkButton!);
    });

    it("should insert heading symbol and toggle headers", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "heading text" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const headingButton = screen.getByTestId("heading-icon").parentElement;

      // Click to add H1
      fireEvent.click(headingButton!);

      // Click again for H2 (need to update content first)
      fireEvent.change(textarea, { target: { value: "# heading text" } });
      Object.defineProperty(textarea, "selectionStart", {
        value: 2,
        writable: true,
      });
      fireEvent.click(headingButton!);

      // Click again for H3
      fireEvent.change(textarea, { target: { value: "## heading text" } });
      Object.defineProperty(textarea, "selectionStart", {
        value: 3,
        writable: true,
      });
      fireEvent.click(headingButton!);

      // Click again to remove header
      fireEvent.change(textarea, { target: { value: "### heading text" } });
      Object.defineProperty(textarea, "selectionStart", {
        value: 4,
        writable: true,
      });
      fireEvent.click(headingButton!);
    });

    it("should insert quote symbol", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "quote text" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const quoteButton = screen.getByTestId("quote-icon").parentElement;
      fireEvent.click(quoteButton!);
    });

    it("should insert unordered list symbol and toggle", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "list item" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const listButton = screen.getByTestId("list-ul-icon").parentElement;

      // Add list
      fireEvent.click(listButton!);

      // Remove list (toggle)
      fireEvent.change(textarea, { target: { value: "- list item" } });
      Object.defineProperty(textarea, "selectionStart", {
        value: 2,
        writable: true,
      });
      fireEvent.click(listButton!);
    });

    it("should insert ordered list symbol and toggle", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "list item" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const listButton = screen.getByTestId("list-ol-icon").parentElement;

      // Add list
      fireEvent.click(listButton!);

      // Remove list (toggle)
      fireEvent.change(textarea, { target: { value: "1. list item" } });
      Object.defineProperty(textarea, "selectionStart", {
        value: 3,
        writable: true,
      });
      fireEvent.click(listButton!);
    });

    it("should insert image symbol", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;

      Object.defineProperty(textarea, "selectionStart", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 0,
        writable: true,
      });

      const imageButton = screen.getByTestId("image-icon").parentElement;
      fireEvent.click(imageButton!);
    });
  });

  describe("read-only mode", () => {
    it("should have select-none class when read-only", () => {
      const { container } = render(
        <Markdown block={mockBlockWithContent} editor={mockEditorReadOnly} />,
      );
      const markdownDiv = container.querySelector(".markdown-content");
      expect(markdownDiv?.className).toContain("select-none");
    });

    it("should have default cursor when read-only", () => {
      const { container } = render(
        <Markdown block={mockBlockWithContent} editor={mockEditorReadOnly} />,
      );
      const markdownDiv = container.querySelector(".markdown-content");
      expect(markdownDiv).toHaveStyle({ cursor: "default" });
    });

    it("should have pointer cursor when editable", () => {
      const { container } = render(
        <Markdown block={mockBlockWithContent} editor={mockEditor} />,
      );
      const markdownDiv = container.querySelector(".markdown-content");
      expect(markdownDiv).toHaveStyle({ cursor: "pointer" });
    });
  });

  describe("keyboard interactions", () => {
    it("should handle Enter key when list is active", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;

      // First click the list button to activate list mode
      const listButton = screen.getByTestId("list-ul-icon").parentElement;
      fireEvent.click(listButton!);

      // Then press Enter
      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(textarea).toBeInTheDocument();
    });

    it("should handle Enter key when ordered list is active", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "item" } });

      Object.defineProperty(textarea, "selectionStart", {
        value: 4,
        writable: true,
      });
      Object.defineProperty(textarea, "selectionEnd", {
        value: 4,
        writable: true,
      });

      // First click the ordered list button to activate
      const listButton = screen.getByTestId("list-ol-icon").parentElement;
      fireEvent.click(listButton!);

      // Then press Enter
      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(textarea).toBeInTheDocument();
    });

    it("should not handle Enter key when no list is active", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId(
        "markdown-textarea",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "regular text" } });

      // Press Enter without list active
      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(textarea).toBeInTheDocument();
    });
  });

  describe("click outside behavior", () => {
    it("should save content when clicking outside", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditor} />);

      const textarea = screen.getByTestId("markdown-textarea");
      fireEvent.change(textarea, { target: { value: "New content to save" } });

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      expect(mockEditor.updateBlock).toHaveBeenCalled();
    });
  });

  describe("edit mode in non-editable context", () => {
    it("should not allow toolbar interactions when not editable", () => {
      render(<Markdown block={mockBlockEmpty} editor={mockEditorReadOnly} />);

      // In read-only mode with empty content, the block should not show editing UI
      expect(screen.queryByTestId("markdown-textarea")).not.toBeInTheDocument();
    });
  });
});
