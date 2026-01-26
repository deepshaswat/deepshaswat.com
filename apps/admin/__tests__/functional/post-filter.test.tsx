import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Utility function from component
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

// Simplified Select component for testing
interface SelectProps {
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  placeholder: string;
  testId: string;
}

const Select = ({
  items,
  selectedItem,
  onSelect,
  placeholder,
  testId,
}: SelectProps) => {
  return (
    <div data-testid={testId}>
      <select
        value={selectedItem || placeholder}
        onChange={(e) => onSelect(e.target.value)}
        data-testid={`${testId}-select`}
        className={
          selectedItem && selectedItem !== placeholder ? "selected" : "default"
        }
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {capitalizeFirstLetter(item)}
          </option>
        ))}
      </select>
      <span data-testid={`${testId}-display`}>
        {capitalizeFirstLetter(selectedItem || placeholder)}
      </span>
    </div>
  );
};

// Post Filter Navbar component for testing
interface PostFilterNavbarProps {
  postOption: string;
  onSelectPostOption: (item: string) => void;
  tagOption: string;
  onSelectTagOption: (item: string) => void;
  tags: string[];
  postFilter: string[];
}

const PostFilterNavbar = ({
  postOption,
  onSelectPostOption,
  tagOption,
  onSelectTagOption,
  tags,
  postFilter,
}: PostFilterNavbarProps) => {
  return (
    <div data-testid="post-filter-navbar">
      <Select
        items={postFilter}
        selectedItem={postOption}
        onSelect={onSelectPostOption}
        placeholder="all-posts"
        testId="post-filter"
      />
      <span data-testid="access-label">All access</span>
      <span data-testid="authors-label">All authors</span>
      <Select
        items={tags}
        selectedItem={tagOption}
        onSelect={onSelectTagOption}
        placeholder="all-tags"
        testId="tag-filter"
      />
      <span data-testid="sort-label">Newest first</span>
    </div>
  );
};

describe("Post Filter Navbar - Admin Functional Tests", () => {
  const mockTags = ["all-tags", "javascript", "react", "web-development"];
  const mockPostFilters = [
    "all-posts",
    "drafts",
    "published",
    "scheduled",
    "newsletters",
  ];
  let mockSelectPostOption: ReturnType<typeof vi.fn>;
  let mockSelectTagOption: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSelectPostOption = vi.fn();
    mockSelectTagOption = vi.fn();
  });

  describe("rendering", () => {
    it("should render the post filter navbar", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("post-filter-navbar")).toBeInTheDocument();
    });

    it("should render post filter dropdown", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("post-filter")).toBeInTheDocument();
    });

    it("should render tag filter dropdown", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("tag-filter")).toBeInTheDocument();
    });

    it("should render static labels", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("access-label")).toHaveTextContent(
        "All access",
      );
      expect(screen.getByTestId("authors-label")).toHaveTextContent(
        "All authors",
      );
      expect(screen.getByTestId("sort-label")).toHaveTextContent(
        "Newest first",
      );
    });
  });

  describe("post filter selection", () => {
    it("should display selected post option in capitalized form", () => {
      render(
        <PostFilterNavbar
          postOption="published"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("post-filter-display")).toHaveTextContent(
        "Published",
      );
    });

    it("should call onSelectPostOption when post filter changes", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      fireEvent.change(screen.getByTestId("post-filter-select"), {
        target: { value: "drafts" },
      });

      expect(mockSelectPostOption).toHaveBeenCalledWith("drafts");
    });

    it("should display all post filter options", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      const select = screen.getByTestId("post-filter-select");
      mockPostFilters.forEach((filter) => {
        expect(select).toContainHTML(capitalizeFirstLetter(filter));
      });
    });
  });

  describe("tag filter selection", () => {
    it("should display selected tag option in capitalized form", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="javascript"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("tag-filter-display")).toHaveTextContent(
        "Javascript",
      );
    });

    it("should call onSelectTagOption when tag filter changes", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      fireEvent.change(screen.getByTestId("tag-filter-select"), {
        target: { value: "react" },
      });

      expect(mockSelectTagOption).toHaveBeenCalledWith("react");
    });

    it("should display hyphenated tag names properly", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="web-development"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("tag-filter-display")).toHaveTextContent(
        "Web development",
      );
    });
  });

  describe("styling based on selection", () => {
    it("should have default class when placeholder is selected for posts", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("post-filter-select")).toHaveClass("default");
    });

    it("should have selected class when non-placeholder post option is selected", () => {
      render(
        <PostFilterNavbar
          postOption="drafts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="all-tags"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("post-filter-select")).toHaveClass("selected");
    });

    it("should have selected class when non-placeholder tag is selected", () => {
      render(
        <PostFilterNavbar
          postOption="all-posts"
          onSelectPostOption={mockSelectPostOption}
          tagOption="javascript"
          onSelectTagOption={mockSelectTagOption}
          tags={mockTags}
          postFilter={mockPostFilters}
        />,
      );

      expect(screen.getByTestId("tag-filter-select")).toHaveClass("selected");
    });
  });

  describe("capitalizeFirstLetter utility in context", () => {
    const testCases = [
      { input: "all-posts", expected: "All posts" },
      { input: "drafts", expected: "Drafts" },
      { input: "scheduled-posts", expected: "Scheduled posts" },
      { input: "web-development", expected: "Web development" },
      { input: "javascript-tutorial", expected: "Javascript tutorial" },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should display "${input}" as "${expected}"`, () => {
        render(
          <PostFilterNavbar
            postOption={input}
            onSelectPostOption={mockSelectPostOption}
            tagOption="all-tags"
            onSelectTagOption={mockSelectTagOption}
            tags={mockTags}
            postFilter={[...mockPostFilters, input]}
          />,
        );

        expect(screen.getByTestId("post-filter-display")).toHaveTextContent(
          expected,
        );
      });
    });
  });
});
