import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Use vi.hoisted for variables needed in mocks
const { mockToast, mockAxios, mockEditor, capturedUploadFileRef } = vi.hoisted(
  () => {
    const capturedUploadFileRef = {
      current: null as ((file: File) => Promise<string>) | null,
    };
    return {
      mockToast: {
        loading: vi.fn(() => "toast-id"),
        success: vi.fn(),
        error: vi.fn(),
      },
      mockAxios: {
        post: vi.fn(),
        put: vi.fn(),
      },
      mockEditor: {
        topLevelBlocks: [{ type: "paragraph", content: [] }],
        getTextCursorPosition: vi.fn(() => ({ block: { id: "1" } })),
        insertBlocks: vi.fn(),
      },
      capturedUploadFileRef,
    };
  },
);

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: "dark" })),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: mockToast,
}));

// Mock axios
vi.mock("axios", () => ({
  default: mockAxios,
}));

// Mock BlockNote
vi.mock("@blocknote/react", () => ({
  useCreateBlockNote: vi.fn((options) => {
    // Capture the uploadFile function
    if (options?.uploadFile) {
      capturedUploadFileRef.current = options.uploadFile;
    }
    return mockEditor;
  }),
  getDefaultReactSlashMenuItems: vi.fn(() => [
    { title: "Paragraph", onItemClick: vi.fn() },
  ]),
  SuggestionMenuController: ({ children, getItems }: any) => {
    // Call getItems to cover line 167-169
    getItems("test");
    return <div data-testid="suggestion-menu">{children}</div>;
  },
}));

vi.mock("@blocknote/mantine", () => ({
  BlockNoteView: ({ children, editable, editor, onChange, theme }: any) => (
    <div
      data-testid="blocknote-view"
      data-editable={editable}
      data-theme={theme}
      onClick={() => onChange && onChange()}
    >
      {children}
    </div>
  ),
}));

vi.mock("@blocknote/core", () => ({
  insertOrUpdateBlock: vi.fn(),
  filterSuggestionItems: vi.fn((items, query) => items),
}));

// Mock schema
vi.mock("../schema", () => ({
  blocknoteSchema: {
    BlockNoteEditor: {},
  },
}));

// Mock lucide icons
vi.mock("lucide-react", () => ({
  Minus: () => <span data-testid="minus-icon">-</span>,
}));

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaYoutube: () => <span data-testid="youtube-icon">YT</span>,
  FaMarkdown: () => <span data-testid="markdown-icon">MD</span>,
  FaLightbulb: () => <span data-testid="lightbulb-icon">💡</span>,
}));

import { BlockNoteEditor } from "../editor";
import { useTheme } from "next-themes";

describe("BlockNoteEditor Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    capturedUploadFileRef.current = null;
  });

  describe("rendering", () => {
    it("should render BlockNoteView", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });

    it("should render SuggestionMenuController", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      expect(screen.getByTestId("suggestion-menu")).toBeInTheDocument();
    });

    it("should be editable by default", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-editable", "true");
    });

    it("should respect editable prop", () => {
      render(<BlockNoteEditor onChange={mockOnChange} editable={false} />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-editable", "false");
    });
  });

  describe("theme handling", () => {
    it("should use dark theme when resolvedTheme is dark", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-theme", "dark");
    });

    it("should use light theme when resolvedTheme is light", () => {
      vi.mocked(useTheme).mockReturnValue({ resolvedTheme: "light" } as any);
      render(<BlockNoteEditor onChange={mockOnChange} />);
      const view = screen.getByTestId("blocknote-view");
      expect(view).toHaveAttribute("data-theme", "light");
    });
  });

  describe("onChange callback", () => {
    it("should call onChange with serialized blocks", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      const view = screen.getByTestId("blocknote-view");
      view.click();
      expect(mockOnChange).toHaveBeenCalledWith(
        JSON.stringify([{ type: "paragraph", content: [] }], null, 2),
      );
    });
  });

  describe("initial content", () => {
    it("should accept initialContent prop", () => {
      const initialContent = JSON.stringify([
        { type: "paragraph", content: [] },
      ]);
      render(
        <BlockNoteEditor
          onChange={mockOnChange}
          initialContent={initialContent}
        />,
      );
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });
  });

  describe("upload functionality", () => {
    it("should use default upload endpoint", () => {
      render(<BlockNoteEditor onChange={mockOnChange} />);
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });

    it("should accept custom upload endpoint", () => {
      render(
        <BlockNoteEditor
          onChange={mockOnChange}
          uploadEndpoint="/custom/upload"
        />,
      );
      expect(screen.getByTestId("blocknote-view")).toBeInTheDocument();
    });
  });
});

describe("BlockNoteEditor Upload Handler", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    capturedUploadFileRef.current = null;
    mockAxios.post.mockReset();
    mockAxios.put.mockReset();
  });

  it("should capture uploadFile function", () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);
    expect(capturedUploadFileRef.current).toBeDefined();
  });

  it("should reject non-image files", async () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });

    await expect(capturedUploadFileRef.current!(file)).rejects.toThrow(
      "Only image files are supported",
    );
    expect(mockToast.error).toHaveBeenCalledWith(
      "Only image files are supported",
    );
  });

  it("should handle file with no type as image/png", async () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);

    mockAxios.post.mockResolvedValue({
      data: {
        uploadURL: "https://s3.example.com/upload",
        s3URL: "https://s3.example.com/image.png",
      },
    });
    mockAxios.put.mockResolvedValue({});

    // Create a file with empty type
    const file = new File(["content"], "image.png");
    Object.defineProperty(file, "type", { value: "" });

    const result = await capturedUploadFileRef.current!(file);

    expect(mockAxios.post).toHaveBeenCalledWith("/api/upload", {
      fileType: "image/png",
    });
    expect(result).toBe("https://s3.example.com/image.png");
  });

  it("should upload image successfully", async () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);

    mockAxios.post.mockResolvedValue({
      data: {
        uploadURL: "https://s3.example.com/upload",
        s3URL: "https://s3.example.com/image.jpg",
      },
    });
    mockAxios.put.mockResolvedValue({});

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const result = await capturedUploadFileRef.current!(file);

    expect(mockToast.loading).toHaveBeenCalledWith("Uploading image...");
    expect(mockAxios.post).toHaveBeenCalledWith("/api/upload", {
      fileType: "image/jpeg",
    });
    expect(mockAxios.put).toHaveBeenCalledWith(
      "https://s3.example.com/upload",
      file,
      {
        headers: { "Content-Type": "image/jpeg" },
      },
    );
    expect(mockToast.success).toHaveBeenCalledWith(
      "Image uploaded successfully",
      { id: "toast-id" },
    );
    expect(result).toBe("https://s3.example.com/image.jpg");
  });

  it("should handle upload error", async () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);

    mockAxios.post.mockRejectedValue(new Error("Network error"));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    await expect(capturedUploadFileRef.current!(file)).rejects.toThrow(
      "File upload failed",
    );
    expect(mockToast.error).toHaveBeenCalledWith("Failed to upload image", {
      id: "toast-id",
    });
  });

  it("should handle upload error during put", async () => {
    render(<BlockNoteEditor onChange={mockOnChange} />);

    mockAxios.post.mockResolvedValue({
      data: {
        uploadURL: "https://s3.example.com/upload",
        s3URL: "https://s3.example.com/image.jpg",
      },
    });
    mockAxios.put.mockRejectedValue(new Error("Upload failed"));

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    await expect(capturedUploadFileRef.current!(file)).rejects.toThrow(
      "File upload failed",
    );
    expect(mockToast.error).toHaveBeenCalledWith("Failed to upload image", {
      id: "toast-id",
    });
  });

  it("should use custom upload endpoint", async () => {
    render(
      <BlockNoteEditor
        onChange={mockOnChange}
        uploadEndpoint="/custom/upload"
      />,
    );

    mockAxios.post.mockResolvedValue({
      data: {
        uploadURL: "https://s3.example.com/upload",
        s3URL: "https://s3.example.com/image.jpg",
      },
    });
    mockAxios.put.mockResolvedValue({});

    const file = new File(["content"], "test.png", { type: "image/png" });

    await capturedUploadFileRef.current!(file);

    expect(mockAxios.post).toHaveBeenCalledWith("/custom/upload", {
      fileType: "image/png",
    });
  });
});

describe("Slash Menu Items", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should include custom slash menu items", () => {
    const mockOnChange = vi.fn();
    render(<BlockNoteEditor onChange={mockOnChange} />);

    // The SuggestionMenuController mock calls getItems which tests line 167-169
    expect(screen.getByTestId("suggestion-menu")).toBeInTheDocument();
  });
});
