import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

// Mock form data interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  unsubscribed: boolean;
}

// Simplified newsletter subscription form for testing
const NewsletterForm = ({
  onSubmit,
  initialLoading = false,
}: {
  onSubmit: (data: FormData) => Promise<void>;
  initialLoading?: boolean;
}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    unsubscribed: false,
  });

  const disabled = formData.email === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setIsSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="newsletter-form">
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          data-testid="firstName-input"
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          data-testid="lastName-input"
        />
      </div>
      <div>
        <label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
          required
          data-testid="email-input"
        />
      </div>
      <button type="submit" disabled={disabled} data-testid="submit-button">
        {loading ? "Subscribing..." : isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
      {error && <div data-testid="error-message">{error}</div>}
      {isSubscribed && (
        <div data-testid="success-message">Successfully subscribed!</div>
      )}
    </form>
  );
};

describe("Newsletter Subscription Form - Functional Tests", () => {
  let mockSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSubmit = vi.fn().mockResolvedValue(undefined);
  });

  describe("form rendering", () => {
    it("should render all form fields", () => {
      render(<NewsletterForm onSubmit={mockSubmit} />);

      expect(screen.getByTestId("firstName-input")).toBeInTheDocument();
      expect(screen.getByTestId("lastName-input")).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should show required indicator on email field", () => {
      render(<NewsletterForm onSubmit={mockSubmit} />);

      const emailLabel = screen.getByText("Email");
      expect(emailLabel.parentElement).toHaveTextContent("*");
    });

    it("should have correct placeholders", () => {
      render(<NewsletterForm onSubmit={mockSubmit} />);

      expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("john.doe@example.com")
      ).toBeInTheDocument();
    });
  });

  describe("form interactions", () => {
    it("should update firstName field on input", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      const firstNameInput = screen.getByTestId("firstName-input");
      await user.type(firstNameInput, "John");

      expect(firstNameInput).toHaveValue("John");
    });

    it("should update lastName field on input", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      const lastNameInput = screen.getByTestId("lastName-input");
      await user.type(lastNameInput, "Doe");

      expect(lastNameInput).toHaveValue("Doe");
    });

    it("should update email field on input", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByTestId("email-input");
      await user.type(emailInput, "john@example.com");

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should allow filling all fields", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("firstName-input"), "John");
      await user.type(screen.getByTestId("lastName-input"), "Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");

      expect(screen.getByTestId("firstName-input")).toHaveValue("John");
      expect(screen.getByTestId("lastName-input")).toHaveValue("Doe");
      expect(screen.getByTestId("email-input")).toHaveValue("john@example.com");
    });
  });

  describe("submit button state", () => {
    it("should be disabled when email is empty", () => {
      render(<NewsletterForm onSubmit={mockSubmit} />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();
    });

    it("should be enabled when email is provided", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).not.toBeDisabled();
    });

    it("should show Subscribe text initially", () => {
      render(<NewsletterForm onSubmit={mockSubmit} />);

      expect(screen.getByTestId("submit-button")).toHaveTextContent("Subscribe");
    });
  });

  describe("form submission", () => {
    it("should call onSubmit with form data when submitted", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("firstName-input"), "John");
      await user.type(screen.getByTestId("lastName-input"), "Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          unsubscribed: false,
        });
      });
    });

    it("should show success message after successful submission", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toBeInTheDocument();
      });
    });

    it("should show Subscribed text after successful submission", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("submit-button")).toHaveTextContent(
          "Subscribed"
        );
      });
    });
  });

  describe("error handling", () => {
    it("should show error message when submission fails", async () => {
      const user = userEvent.setup();
      const failingSubmit = vi
        .fn()
        .mockRejectedValue(new Error("Subscription failed"));
      render(<NewsletterForm onSubmit={failingSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Subscription failed"
        );
      });
    });

    it("should show generic error for non-Error exceptions", async () => {
      const user = userEvent.setup();
      const failingSubmit = vi.fn().mockRejectedValue("Unknown error");
      render(<NewsletterForm onSubmit={failingSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Something went wrong"
        );
      });
    });

    it("should not show success message when submission fails", async () => {
      const user = userEvent.setup();
      const failingSubmit = vi
        .fn()
        .mockRejectedValue(new Error("Subscription failed"));
      render(<NewsletterForm onSubmit={failingSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
      });
    });
  });

  describe("loading state", () => {
    it("should show loading text during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const slowSubmit = vi.fn().mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      );
      render(<NewsletterForm onSubmit={slowSubmit} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Subscribing..."
      );

      // Clean up
      resolveSubmit!();
    });
  });

  describe("email validation scenarios", () => {
    it("should enable submit with minimal email", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("email-input"), "a@b.c");

      expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });

    it("should enable submit with complex email", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={mockSubmit} />);

      await user.type(
        screen.getByTestId("email-input"),
        "user.name+tag@subdomain.example.com"
      );

      expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });
  });
});
