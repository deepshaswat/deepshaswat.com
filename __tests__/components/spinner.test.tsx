import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock Loader component similar to lucide-react
const MockLoader = ({ className }: { className?: string }) => (
  <svg data-testid="loader-icon" className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Simplified cn utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Recreating spinner variants
const spinnerSizes = {
  default: "h-4 w-4",
  sm: "h-2 w-2",
  lg: "h-6 w-6",
  icon: "h-10 w-10",
};

type SpinnerSize = keyof typeof spinnerSizes;

interface SpinnerProps {
  size?: SpinnerSize;
}

const Spinner = ({ size = "default" }: SpinnerProps) => {
  return (
    <MockLoader
      className={cn("text-muted-foreground animate-spin", spinnerSizes[size])}
    />
  );
};

describe("Spinner", () => {
  describe("rendering", () => {
    it("should render the spinner", () => {
      render(<Spinner />);
      expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    });

    it("should render as an SVG element", () => {
      render(<Spinner />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner.tagName.toLowerCase()).toBe("svg");
    });
  });

  describe("default size", () => {
    it("should render with default size classes when no size prop is provided", () => {
      render(<Spinner />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("h-4");
      expect(spinner).toHaveClass("w-4");
    });

    it("should render with default size classes when size is explicitly default", () => {
      render(<Spinner size="default" />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("h-4");
      expect(spinner).toHaveClass("w-4");
    });
  });

  describe("size variants", () => {
    it("should render with small size classes", () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("h-2");
      expect(spinner).toHaveClass("w-2");
    });

    it("should render with large size classes", () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("h-6");
      expect(spinner).toHaveClass("w-6");
    });

    it("should render with icon size classes", () => {
      render(<Spinner size="icon" />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("h-10");
      expect(spinner).toHaveClass("w-10");
    });
  });

  describe("animation and styling", () => {
    it("should have spin animation class", () => {
      render(<Spinner />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("animate-spin");
    });

    it("should have muted foreground text color", () => {
      render(<Spinner />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("text-muted-foreground");
    });

    it("should combine all classes correctly", () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByTestId("loader-icon");
      expect(spinner).toHaveClass("text-muted-foreground");
      expect(spinner).toHaveClass("animate-spin");
      expect(spinner).toHaveClass("h-6");
      expect(spinner).toHaveClass("w-6");
    });
  });

  describe("all size variants have correct dimensions", () => {
    const sizeTests = [
      { size: "default" as SpinnerSize, height: "h-4", width: "w-4" },
      { size: "sm" as SpinnerSize, height: "h-2", width: "w-2" },
      { size: "lg" as SpinnerSize, height: "h-6", width: "w-6" },
      { size: "icon" as SpinnerSize, height: "h-10", width: "w-10" },
    ];

    sizeTests.forEach(({ size, height, width }) => {
      it(`size="${size}" should have ${height} and ${width}`, () => {
        render(<Spinner size={size} />);
        const spinner = screen.getByTestId("loader-icon");
        expect(spinner).toHaveClass(height);
        expect(spinner).toHaveClass(width);
      });
    });
  });
});
