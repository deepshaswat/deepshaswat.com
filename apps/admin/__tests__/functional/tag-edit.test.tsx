import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

// Utility functions from the component
function reverseAndHyphenate(item: string): string {
  return item.toLowerCase().split(" ").join("-");
}

function capitalizeFirstLetter(item: string): string {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
}

// Simplified TagEditForm for testing
interface TagEditFormProps {
  id: string;
  initialSlug: string;
  initialDescription?: string;
  initialImageUrl?: string;
  onSubmit: (data: {
    id: string;
    slug: string;
    description?: string;
    imageUrl?: string;
  }) => Promise<{ slug: string } | { error: string }>;
  onDelete: (slug: string) => Promise<void>;
  onNavigate: (path: string) => void;
}

const TagEditForm = ({
  id,
  initialSlug,
  initialDescription = "",
  initialImageUrl = "",
  onSubmit,
  onDelete,
  onNavigate,
}: TagEditFormProps) => {
  const [slug, setSlug] = useState(initialSlug);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isEmpty = slug === "";

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(reverseAndHyphenate(e.target.value));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    const result = await onSubmit({
      id,
      slug,
      description,
      imageUrl,
    });

    setIsSubmitting(false);

    if ("error" in result) {
      setError(result.error);
    } else {
      setSlug(result.slug);
      onNavigate(`/tags/${result.slug}`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(slug);
    } finally {
      setIsDeleting(false);
      onNavigate("/tags");
    }
  };

  return (
    <div data-testid="tag-edit-form">
      <nav data-testid="breadcrumb">
        <a href="/tags">Tags</a>
        <span>Edit tag</span>
      </nav>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        data-testid="save-button"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>

      <h1 data-testid="tag-title">{capitalizeFirstLetter(slug)}</h1>

      <div>
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={handleSlugChange}
          data-testid="slug-input"
        />
        <span data-testid="slug-preview">
          www.deepshaswat.com/tags/{isEmpty ? "" : `${slug}/`}
        </span>
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          data-testid="description-input"
          maxLength={500}
        />
        <span data-testid="char-count">
          Maximum: 500 characters. You've used {description.length}.
        </span>
      </div>

      <div>
        <label htmlFor="image">Tag image</label>
        <input
          id="image"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          data-testid="image-input"
        />
      </div>

      {error && <div data-testid="error-message">{error}</div>}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        data-testid="delete-button"
      >
        {isDeleting ? "Deleting..." : "Delete Tag"}
      </button>
    </div>
  );
};

describe("Tag Edit Form - Admin Functional Tests", () => {
  let mockSubmit: ReturnType<typeof vi.fn>;
  let mockDelete: ReturnType<typeof vi.fn>;
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSubmit = vi.fn().mockResolvedValue({ slug: "test-tag" });
    mockDelete = vi.fn().mockResolvedValue(undefined);
    mockNavigate = vi.fn();
  });

  describe("rendering", () => {
    it("should render the tag edit form", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("tag-edit-form")).toBeInTheDocument();
    });

    it("should display breadcrumb navigation", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
      expect(screen.getByText("Tags")).toBeInTheDocument();
      expect(screen.getByText("Edit tag")).toBeInTheDocument();
    });

    it("should display capitalized tag title", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="web-development"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("tag-title")).toHaveTextContent(
        "Web development",
      );
    });

    it("should display slug preview URL", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("slug-preview")).toHaveTextContent(
        "www.deepshaswat.com/tags/test-tag/",
      );
    });

    it("should pre-fill form with initial values", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="my-tag"
          initialDescription="A test description"
          initialImageUrl="https://example.com/image.png"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("slug-input")).toHaveValue("my-tag");
      expect(screen.getByTestId("description-input")).toHaveValue(
        "A test description",
      );
      expect(screen.getByTestId("image-input")).toHaveValue(
        "https://example.com/image.png",
      );
    });
  });

  describe("slug input behavior", () => {
    it("should convert input to hyphenated lowercase slug", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug=""
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      const slugInput = screen.getByTestId("slug-input");
      await user.clear(slugInput);
      await user.type(slugInput, "Web Development");

      expect(slugInput).toHaveValue("web-development");
    });

    it("should update title when slug changes", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="old-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      const slugInput = screen.getByTestId("slug-input");
      await user.clear(slugInput);
      await user.type(slugInput, "New Tag");

      expect(screen.getByTestId("tag-title")).toHaveTextContent("New tag");
    });

    it("should update URL preview when slug changes", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="old-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      const slugInput = screen.getByTestId("slug-input");
      await user.clear(slugInput);
      await user.type(slugInput, "new slug");

      expect(screen.getByTestId("slug-preview")).toHaveTextContent(
        "www.deepshaswat.com/tags/new-slug/",
      );
    });
  });

  describe("description input", () => {
    it("should update description when typing", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      const descInput = screen.getByTestId("description-input");
      await user.type(descInput, "New description");

      expect(descInput).toHaveValue("New description");
    });

    it("should display character count", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          initialDescription=""
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("char-count")).toHaveTextContent(
        "You've used 0",
      );

      const descInput = screen.getByTestId("description-input");
      await user.type(descInput, "Hello");

      expect(screen.getByTestId("char-count")).toHaveTextContent(
        "You've used 5",
      );
    });

    it("should have max length of 500", () => {
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      expect(screen.getByTestId("description-input")).toHaveAttribute(
        "maxLength",
        "500",
      );
    });
  });

  describe("form submission", () => {
    it("should call onSubmit with form data", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-123"
          initialSlug="test-tag"
          initialDescription="Description"
          initialImageUrl="https://example.com/img.png"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("save-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          id: "tag-123",
          slug: "test-tag",
          description: "Description",
          imageUrl: "https://example.com/img.png",
        });
      });
    });

    it("should navigate on successful save", async () => {
      const user = userEvent.setup();
      mockSubmit.mockResolvedValue({ slug: "updated-tag" });
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("save-button"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/tags/updated-tag");
      });
    });

    it("should show error message on failed save", async () => {
      const user = userEvent.setup();
      mockSubmit.mockResolvedValue({ error: "Failed to save tag" });
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("save-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Failed to save tag",
        );
      });
    });

    it("should show saving state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: { slug: string }) => void;
      mockSubmit.mockImplementation(
        () =>
          new Promise<{ slug: string }>((resolve) => {
            resolveSubmit = resolve;
          }),
      );
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("save-button"));

      expect(screen.getByTestId("save-button")).toHaveTextContent("Saving...");
      expect(screen.getByTestId("save-button")).toBeDisabled();

      resolveSubmit!({ slug: "test-tag" });
    });
  });

  describe("delete functionality", () => {
    it("should call onDelete with current slug", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="tag-to-delete"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith("tag-to-delete");
      });
    });

    it("should navigate to tags list after delete", async () => {
      const user = userEvent.setup();
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("delete-button"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/tags");
      });
    });

    it("should show deleting state", async () => {
      const user = userEvent.setup();
      let resolveDelete: () => void;
      mockDelete.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveDelete = resolve;
          }),
      );
      render(
        <TagEditForm
          id="tag-1"
          initialSlug="test-tag"
          onSubmit={mockSubmit}
          onDelete={mockDelete}
          onNavigate={mockNavigate}
        />,
      );

      await user.click(screen.getByTestId("delete-button"));

      expect(screen.getByTestId("delete-button")).toHaveTextContent(
        "Deleting...",
      );
      expect(screen.getByTestId("delete-button")).toBeDisabled();

      resolveDelete!();
    });
  });
});
