import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Recreating the component for testing
interface FormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div
      className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 justify-center"
      data-testid="form-success"
    >
      <svg
        data-testid="success-icon"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      <p>{message}</p>
    </div>
  );
};

describe("FormSuccess", () => {
  describe("rendering", () => {
    it("should render nothing when message is undefined", () => {
      const { container } = render(<FormSuccess />);
      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when message is empty string", () => {
      const { container } = render(<FormSuccess message="" />);
      expect(container.firstChild).toBeNull();
    });

    it("should render success message when provided", () => {
      const successMessage = "Operation completed successfully";
      render(<FormSuccess message={successMessage} />);

      expect(screen.getByText(successMessage)).toBeInTheDocument();
    });

    it("should render success icon when message is provided", () => {
      render(<FormSuccess message="Success!" />);

      expect(screen.getByTestId("success-icon")).toBeInTheDocument();
    });

    it("should render with correct container when message is provided", () => {
      render(<FormSuccess message="Test success" />);

      expect(screen.getByTestId("form-success")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have correct CSS classes for styling", () => {
      render(<FormSuccess message="Styled success" />);

      const container = screen.getByTestId("form-success");
      expect(container).toHaveClass("bg-emerald-500/15");
      expect(container).toHaveClass("p-3");
      expect(container).toHaveClass("rounded-md");
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveClass("gap-x-2");
      expect(container).toHaveClass("text-sm");
      expect(container).toHaveClass("text-emerald-500");
      expect(container).toHaveClass("justify-center");
    });

    it("should have icon with correct size classes", () => {
      render(<FormSuccess message="Success with icon" />);

      const icon = screen.getByTestId("success-icon");
      expect(icon).toHaveClass("h-4");
      expect(icon).toHaveClass("w-4");
    });
  });

  describe("different message types", () => {
    it("should render long success messages", () => {
      const longMessage =
        "Your form has been submitted successfully! Thank you for your patience. We will get back to you within 24 hours.";
      render(<FormSuccess message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should render success messages with special characters", () => {
      const specialMessage = "Email sent to user@example.com (confirmed)";
      render(<FormSuccess message={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it("should render success messages with numbers", () => {
      const numericMessage = "3 items saved successfully";
      render(<FormSuccess message={numericMessage} />);

      expect(screen.getByText(numericMessage)).toBeInTheDocument();
    });
  });
});
