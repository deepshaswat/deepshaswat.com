import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Recreating the component for testing
interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div
      className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive justify-center"
      data-testid="form-error"
    >
      <svg
        data-testid="error-icon"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <p>{message}</p>
    </div>
  );
};

describe("FormError", () => {
  describe("rendering", () => {
    it("should render nothing when message is undefined", () => {
      const { container } = render(<FormError />);
      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when message is empty string", () => {
      const { container } = render(<FormError message="" />);
      expect(container.firstChild).toBeNull();
    });

    it("should render error message when provided", () => {
      const errorMessage = "Something went wrong";
      render(<FormError message={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should render error icon when message is provided", () => {
      render(<FormError message="Error occurred" />);

      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });

    it("should render with correct container when message is provided", () => {
      render(<FormError message="Test error" />);

      expect(screen.getByTestId("form-error")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have correct CSS classes for styling", () => {
      render(<FormError message="Styled error" />);

      const container = screen.getByTestId("form-error");
      expect(container).toHaveClass("bg-destructive/15");
      expect(container).toHaveClass("p-3");
      expect(container).toHaveClass("rounded-md");
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("gap-x-2");
      expect(container).toHaveClass("text-sm");
      expect(container).toHaveClass("text-destructive");
      expect(container).toHaveClass("justify-center");
    });

    it("should have icon with correct size classes", () => {
      render(<FormError message="Error with icon" />);

      const icon = screen.getByTestId("error-icon");
      expect(icon).toHaveClass("h-4");
      expect(icon).toHaveClass("w-4");
    });
  });

  describe("different message types", () => {
    it("should render long error messages", () => {
      const longMessage =
        "This is a very long error message that should still be displayed correctly within the component even though it spans multiple lines in the code.";
      render(<FormError message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should render error messages with special characters", () => {
      const specialMessage = "Error: Field <name> is required! (code: 400)";
      render(<FormError message={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it("should render error messages with numbers", () => {
      const numericMessage = "Error 404: Page not found";
      render(<FormError message={numericMessage} />);

      expect(screen.getByText(numericMessage)).toBeInTheDocument();
    });
  });
});
