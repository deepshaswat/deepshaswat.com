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

// Mock UI components
vi.mock("../../../../ui/alert-dialog", () => ({
  AlertDialog: ({ children }: any) => (
    <div data-testid="alert-dialog">{children}</div>
  ),
  AlertDialogTrigger: ({ children, className }: any) => (
    <div data-testid="alert-dialog-trigger" className={className}>
      {children}
    </div>
  ),
  AlertDialogContent: ({ children, className }: any) => (
    <div data-testid="alert-dialog-content" className={className}>
      {children}
    </div>
  ),
  AlertDialogHeader: ({ children }: any) => (
    <div data-testid="alert-dialog-header">{children}</div>
  ),
  AlertDialogTitle: ({ children }: any) => (
    <h2 data-testid="alert-dialog-title">{children}</h2>
  ),
  AlertDialogDescription: ({ children }: any) => (
    <div data-testid="alert-dialog-description">{children}</div>
  ),
  AlertDialogFooter: ({ children }: any) => (
    <div data-testid="alert-dialog-footer">{children}</div>
  ),
  AlertDialogCancel: ({ children, className }: any) => (
    <button data-testid="alert-dialog-cancel" className={className}>
      {children}
    </button>
  ),
  AlertDialogAction: ({ children, onClick, className }: any) => (
    <button
      data-testid="alert-dialog-action"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../../../ui/button", () => ({
  Button: ({ children, className, variant, size }: any) => (
    <button
      data-testid="button"
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../../../ui/input", () => ({
  Input: ({ onChange, className, placeholder, type }: any) => (
    <input
      data-testid="input"
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      type={type}
    />
  ),
}));

vi.mock("react-icons/fa", () => ({
  FaYoutube: () => <span data-testid="youtube-icon">YT</span>,
}));

import { Youtube } from "../../blocks/youtube";

describe("Youtube Block", () => {
  const mockEditor = {
    updateBlock: vi.fn(),
  };

  const mockBlockWithUrl = {
    props: {
      url: "https://www.youtube.com/embed/abc123",
    },
  };

  const mockBlockWithoutUrl = {
    props: {
      url: "",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("block configuration", () => {
    it("should have correct type", () => {
      expect(Youtube.config.type).toBe("youtube");
    });

    it("should have url prop with empty default", () => {
      expect(Youtube.config.propSchema.url.default).toBe("");
    });

    it("should have content set to none", () => {
      expect(Youtube.config.content).toBe("none");
    });
  });

  describe("render with URL", () => {
    it("should render iframe when URL is provided", () => {
      const { container } = render(
        <Youtube block={mockBlockWithUrl} editor={mockEditor} />,
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("src", mockBlockWithUrl.props.url);
    });

    it("should have correct iframe attributes", () => {
      const { container } = render(
        <Youtube block={mockBlockWithUrl} editor={mockEditor} />,
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("title", "YouTube video player");
      expect(iframe).toHaveAttribute("allowFullScreen");
    });

    it("should have aspect-video class on wrapper", () => {
      const { container } = render(
        <Youtube block={mockBlockWithUrl} editor={mockEditor} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("aspect-video");
    });
  });

  describe("render without URL", () => {
    it("should render add video button when no URL", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(screen.getByTestId("button")).toBeInTheDocument();
      expect(screen.getByText("Add Video")).toBeInTheDocument();
    });

    it("should render YouTube icon", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(screen.getByTestId("youtube-icon")).toBeInTheDocument();
    });

    it("should render alert dialog components", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("alert-dialog-trigger")).toBeInTheDocument();
    });

    it("should render dialog title", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(
        screen.getByText("Place YouTube video URL here:"),
      ).toBeInTheDocument();
    });

    it("should render input for URL", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(screen.getByTestId("input")).toBeInTheDocument();
    });

    it("should render cancel and embed buttons", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Embed")).toBeInTheDocument();
    });
  });

  describe("URL conversion", () => {
    it("should convert watch URL to embed URL on embed click", () => {
      render(<Youtube block={mockBlockWithoutUrl} editor={mockEditor} />);

      const input = screen.getByTestId("input");
      fireEvent.change(input, {
        target: { value: "https://www.youtube.com/watch?v=abc123" },
      });

      const embedButton = screen.getByTestId("alert-dialog-action");
      fireEvent.click(embedButton);

      expect(mockEditor.updateBlock).toHaveBeenCalledWith(mockBlockWithoutUrl, {
        type: "youtube",
        props: {
          url: "https://www.youtube.com/embed/abc123",
        },
      });
    });
  });
});
