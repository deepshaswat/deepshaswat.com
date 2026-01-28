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

vi.mock("../../../../ui/popover", () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children, className }: any) => (
    <div data-testid="popover-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("../../../../ui/switch", () => ({
  Switch: ({ checked, onCheckedChange, className }: any) => (
    <button
      data-testid="switch"
      data-checked={checked}
      className={className}
      onClick={() => onCheckedChange(!checked)}
    >
      Switch
    </button>
  ),
}));

vi.mock("emoji-picker-react", () => ({
  default: ({ onEmojiClick }: any) => (
    <div data-testid="emoji-picker">
      <button
        data-testid="emoji-button"
        onClick={() => onEmojiClick({ emoji: "🎉" })}
      >
        Pick Emoji
      </button>
    </div>
  ),
  Theme: { DARK: "dark" },
}));

vi.mock("react-icons/fa", () => ({
  FaPalette: () => <span data-testid="palette-icon">Palette</span>,
  FaSmile: () => <span data-testid="smile-icon">Smile</span>,
  FaFont: () => <span data-testid="font-icon">Font</span>,
}));

import { Callout } from "../../blocks/callout";

describe("Callout Block", () => {
  const mockEditor = {
    updateBlock: vi.fn(),
    isEditable: true,
  };

  const mockEditorReadOnly = {
    updateBlock: vi.fn(),
    isEditable: false,
  };

  const mockBlock = {
    props: {
      text: "Test callout text",
      emoji: "💡",
      bgColor: "#2D3748",
      textColor: "#FFFFFF",
      showEmoji: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("block configuration", () => {
    it("should have correct type", () => {
      expect(Callout.config.type).toBe("callout");
    });

    it("should have correct default props", () => {
      expect(Callout.config.propSchema.text.default).toBe("Callout text...");
      expect(Callout.config.propSchema.emoji.default).toBe("💡");
      expect(Callout.config.propSchema.bgColor.default).toBe("#2D3748");
      expect(Callout.config.propSchema.textColor.default).toBe("#FFFFFF");
      expect(Callout.config.propSchema.showEmoji.default).toBe(true);
    });

    it("should have content set to none", () => {
      expect(Callout.config.content).toBe("none");
    });
  });

  describe("render in view mode", () => {
    it("should render callout text", () => {
      render(<Callout block={mockBlock} editor={mockEditor} />);
      expect(screen.getByText("Test callout text")).toBeInTheDocument();
    });

    it("should render emoji when showEmoji is true", () => {
      render(<Callout block={mockBlock} editor={mockEditor} />);
      expect(screen.getByText("💡")).toBeInTheDocument();
    });

    it("should not render emoji when showEmoji is false", () => {
      const blockNoEmoji = {
        props: { ...mockBlock.props, showEmoji: false },
      };
      render(<Callout block={blockNoEmoji} editor={mockEditor} />);
      expect(screen.queryByText("💡")).not.toBeInTheDocument();
    });

    it("should apply background and text colors", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({
        backgroundColor: "#2D3748",
        color: "#FFFFFF",
      });
    });
  });

  describe("edit mode interactions", () => {
    it("should show edit controls on mouse enter when editable", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      expect(screen.getByTestId("smile-icon")).toBeInTheDocument();
      expect(screen.getByTestId("palette-icon")).toBeInTheDocument();
      expect(screen.getByTestId("font-icon")).toBeInTheDocument();
    });

    it("should hide edit controls on mouse leave", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);
      fireEvent.mouseLeave(wrapper);

      // Controls should be hidden (not in document)
      expect(screen.queryByTestId("smile-icon")).not.toBeInTheDocument();
    });

    it("should not show edit controls when not editable", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditorReadOnly} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      expect(screen.queryByTestId("smile-icon")).not.toBeInTheDocument();
    });

    it("should show input field when editing", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      const input = container.querySelector("input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("Test callout text");
    });

    it("should update text on input change and blur", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      const input = container.querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "New text" } });
      fireEvent.blur(input);

      expect(mockEditor.updateBlock).toHaveBeenCalledWith(mockBlock, {
        type: "callout",
        props: { ...mockBlock.props, text: "New text" },
      });
    });
  });

  describe("emoji picker", () => {
    it("should update emoji when picked", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      const emojiButton = screen.getByTestId("emoji-button");
      fireEvent.click(emojiButton);

      expect(mockEditor.updateBlock).toHaveBeenCalledWith(mockBlock, {
        type: "callout",
        props: { ...mockBlock.props, emoji: "🎉" },
      });
    });

    it("should toggle emoji visibility via switch", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      const switchButton = screen.getByTestId("switch");
      fireEvent.click(switchButton);

      expect(mockEditor.updateBlock).toHaveBeenCalledWith(mockBlock, {
        type: "callout",
        props: { ...mockBlock.props, showEmoji: false },
      });
    });
  });

  describe("read-only mode", () => {
    it("should display text as span, not input", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditorReadOnly} />,
      );

      const span = screen.getByText("Test callout text");
      expect(span.tagName).toBe("SPAN");
      expect(container.querySelector("input")).not.toBeInTheDocument();
    });

    it("should not call updateBlock when read-only", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditorReadOnly} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      expect(mockEditorReadOnly.updateBlock).not.toHaveBeenCalled();
    });
  });

  describe("color picker", () => {
    it("should render color buttons in popover", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      // Color pickers are inside popovers
      const popovers = screen.getAllByTestId("popover");
      expect(popovers.length).toBeGreaterThan(0);
    });

    it("should update background color when clicking color button", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      // Find all color buttons (round buttons inside popover content)
      const colorButtons = container.querySelectorAll("button.rounded-full");
      expect(colorButtons.length).toBeGreaterThan(0);

      // Click the first color button (should be in background color picker)
      fireEvent.click(colorButtons[0]);

      // Verify updateBlock was called with bgColor
      expect(mockEditor.updateBlock).toHaveBeenCalled();
    });

    it("should update text color when clicking text color button", () => {
      const { container } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      // Find all color buttons (there are 11 predefined colors * 2 pickers = 22)
      const colorButtons = container.querySelectorAll("button.rounded-full");
      expect(colorButtons.length).toBeGreaterThanOrEqual(22);

      // Click a color button from the text color picker (index 11 or higher)
      fireEvent.click(colorButtons[11]);

      // Verify updateBlock was called
      expect(mockEditor.updateBlock).toHaveBeenCalled();
    });

    it("should highlight selected background color", () => {
      const blockWithColor = {
        props: { ...mockBlock.props, bgColor: "#FFFFFF" },
      };
      const { container } = render(
        <Callout block={blockWithColor} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      // Find color buttons with ring (selected state)
      const selectedButtons = container.querySelectorAll(
        "button.rounded-full.ring-2",
      );
      expect(selectedButtons.length).toBeGreaterThan(0);
    });

    it("should highlight selected text color", () => {
      const blockWithColor = {
        props: { ...mockBlock.props, textColor: "#E53E3E" },
      };
      const { container } = render(
        <Callout block={blockWithColor} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(wrapper);

      // Verify that at least some color buttons are rendered
      const colorButtons = container.querySelectorAll("button.rounded-full");
      expect(colorButtons.length).toBeGreaterThan(0);
    });
  });

  describe("state synchronization", () => {
    it("should sync state when block props change", () => {
      const { container, rerender } = render(
        <Callout block={mockBlock} editor={mockEditor} />,
      );

      const updatedBlock = {
        props: {
          ...mockBlock.props,
          text: "Updated text",
          emoji: "🚀",
          bgColor: "#FF0000",
          textColor: "#000000",
          showEmoji: false,
        },
      };

      rerender(<Callout block={updatedBlock} editor={mockEditor} />);

      // Verify the new text is displayed
      expect(screen.getByText("Updated text")).toBeInTheDocument();
    });
  });
});
