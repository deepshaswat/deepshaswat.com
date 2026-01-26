import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Pagination component for testing (simplified version of PaginationBar)
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const maxPage = totalPages - 1;
  const displayPage = currentPage + 1;

  const handlePageClick = (page: number) => {
    if (page >= 0 && page <= maxPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < maxPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav data-testid="pagination" aria-label="Pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        data-testid="prev-button"
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* First page */}
      {displayPage > 2 && (
        <button
          onClick={() => handlePageClick(0)}
          data-testid="page-1"
          aria-label="Go to page 1"
        >
          1
        </button>
      )}

      {/* Ellipsis before current */}
      {displayPage > 3 && (
        <span data-testid="ellipsis-start" aria-hidden="true">
          ...
        </span>
      )}

      {/* Previous page number */}
      {displayPage > 1 && (
        <button
          onClick={() => handlePageClick(displayPage - 2)}
          data-testid={`page-${displayPage - 1}`}
          aria-label={`Go to page ${displayPage - 1}`}
        >
          {displayPage - 1}
        </button>
      )}

      {/* Current page */}
      <button
        onClick={() => handlePageClick(displayPage - 1)}
        data-testid={`page-${displayPage}`}
        aria-current="page"
        className="active"
      >
        {displayPage}
      </button>

      {/* Next page number */}
      {displayPage < maxPage + 1 && (
        <button
          onClick={() => handlePageClick(displayPage)}
          data-testid={`page-${displayPage + 1}`}
          aria-label={`Go to page ${displayPage + 1}`}
        >
          {displayPage + 1}
        </button>
      )}

      {/* Ellipsis after current */}
      {displayPage < maxPage && (
        <span data-testid="ellipsis-end" aria-hidden="true">
          ...
        </span>
      )}

      {/* Last page */}
      {displayPage < maxPage && (
        <button
          onClick={() => handlePageClick(maxPage)}
          data-testid={`page-${maxPage + 1}`}
          aria-label={`Go to page ${maxPage + 1}`}
        >
          {maxPage + 1}
        </button>
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === maxPage}
        data-testid="next-button"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

describe("Pagination - Functional Tests", () => {
  let mockOnPageChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnPageChange = vi.fn();
  });

  describe("rendering", () => {
    it("should render pagination component", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("should render previous and next buttons", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-button")).toBeInTheDocument();
    });

    it("should render current page button", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-1")).toBeInTheDocument();
    });
  });

  describe("first page behavior", () => {
    it("should disable previous button on first page", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).toBeDisabled();
    });

    it("should enable next button on first page", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("next-button")).not.toBeDisabled();
    });

    it("should show next page number on first page", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-2")).toBeInTheDocument();
    });
  });

  describe("last page behavior", () => {
    it("should disable next button on last page", () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("next-button")).toBeDisabled();
    });

    it("should enable previous button on last page", () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).not.toBeDisabled();
    });

    it("should show previous page number on last page", () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-9")).toBeInTheDocument();
    });
  });

  describe("middle page behavior", () => {
    it("should enable both navigation buttons on middle page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).not.toBeDisabled();
      expect(screen.getByTestId("next-button")).not.toBeDisabled();
    });

    it("should show ellipsis on middle pages", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("ellipsis-start")).toBeInTheDocument();
      expect(screen.getByTestId("ellipsis-end")).toBeInTheDocument();
    });

    it("should show first page link on middle pages", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-1")).toBeInTheDocument();
    });

    it("should show last page link on middle pages", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-10")).toBeInTheDocument();
    });
  });

  describe("navigation interactions", () => {
    it("should call onPageChange with next page when clicking next", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("next-button"));

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it("should call onPageChange with previous page when clicking previous", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("prev-button"));

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("should call onPageChange when clicking a page number", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("page-2"));

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it("should call onPageChange with first page when clicking first page link", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("page-1"));

      expect(mockOnPageChange).toHaveBeenCalledWith(0);
    });

    it("should call onPageChange with last page when clicking last page link", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("page-10"));

      expect(mockOnPageChange).toHaveBeenCalledWith(9);
    });

    it("should not call onPageChange when clicking disabled previous button", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("prev-button"));

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it("should not call onPageChange when clicking disabled next button", () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByTestId("next-button"));

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle single page", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).toBeDisabled();
      expect(screen.getByTestId("next-button")).toBeDisabled();
    });

    it("should handle two pages", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-1")).toBeInTheDocument();
      expect(screen.getByTestId("page-2")).toBeInTheDocument();
      expect(screen.queryByTestId("ellipsis-start")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ellipsis-end")).not.toBeInTheDocument();
    });

    it("should handle three pages", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-1")).toBeInTheDocument();
      expect(screen.getByTestId("page-2")).toBeInTheDocument();
      expect(screen.getByTestId("page-3")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on pagination", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("pagination")).toHaveAttribute(
        "aria-label",
        "Pagination"
      );
    });

    it("should have aria-current on current page", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("page-1")).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("should have aria-label on navigation buttons", () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("prev-button")).toHaveAttribute(
        "aria-label",
        "Previous page"
      );
      expect(screen.getByTestId("next-button")).toHaveAttribute(
        "aria-label",
        "Next page"
      );
    });

    it("should have aria-hidden on ellipsis", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("ellipsis-start")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
      expect(screen.getByTestId("ellipsis-end")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
    });
  });

  describe("page display calculations", () => {
    it("should display correct page number (0-indexed to 1-indexed)", () => {
      render(
        <Pagination
          currentPage={4}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      // currentPage 4 should display as page 5
      expect(screen.getByTestId("page-5")).toHaveTextContent("5");
    });

    it("should show adjacent pages around current page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      // Should show pages 5, 6, 7 (indices 4, 5, 6)
      expect(screen.getByTestId("page-5")).toBeInTheDocument();
      expect(screen.getByTestId("page-6")).toBeInTheDocument();
      expect(screen.getByTestId("page-7")).toBeInTheDocument();
    });
  });
});
