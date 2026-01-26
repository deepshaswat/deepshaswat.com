import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { z } from "zod";

// Contact schema matching the actual app
const ContactSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  name: z.string().min(6, { message: "Name is required" }),
  message: z.string().min(20, { message: "Minimum of length 20 is required" }),
});

type ContactFormData = z.infer<typeof ContactSchema>;

// Contact form component for testing
const ContactForm = ({
  onSubmit,
}: {
  onSubmit: (data: ContactFormData) => Promise<{ error?: string; success?: boolean }>;
}) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // Validate with Zod
    const result = ContactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsPending(true);
    try {
      const response = await onSubmit(result.data);
      if (response.error) {
        setSubmitError(response.error);
      } else if (response.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      setSubmitError("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div data-testid="contact-form-container">
      <h2>Let's Talk</h2>
      <form onSubmit={handleSubmit} data-testid="contact-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isPending}
            placeholder="John Doe"
            data-testid="name-input"
          />
          {errors.name && (
            <span data-testid="name-error" className="error">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            disabled={isPending}
            placeholder="john.doe@example.com"
            data-testid="email-input"
          />
          {errors.email && (
            <span data-testid="email-error" className="error">
              {errors.email}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isPending}
            placeholder="Enter your message"
            data-testid="message-input"
          />
          {errors.message && (
            <span data-testid="message-error" className="error">
              {errors.message}
            </span>
          )}
        </div>
        {submitError && <div data-testid="submit-error">{submitError}</div>}
        {isSuccess && (
          <div data-testid="success-message">Message sent successfully!</div>
        )}
        <button type="submit" disabled={isPending} data-testid="submit-button">
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

describe("Contact Form - Functional Tests", () => {
  let mockSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSubmit = vi.fn().mockResolvedValue({ success: true });
  });

  describe("form rendering", () => {
    it("should render contact form with all fields", () => {
      render(<ContactForm onSubmit={mockSubmit} />);

      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
      expect(screen.getByTestId("name-input")).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("message-input")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should display form title", () => {
      render(<ContactForm onSubmit={mockSubmit} />);

      expect(screen.getByText("Let's Talk")).toBeInTheDocument();
    });

    it("should have correct placeholders", () => {
      render(<ContactForm onSubmit={mockSubmit} />);

      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("john.doe@example.com")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your message")
      ).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("should show error for name shorter than 6 characters", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that is long enough."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name is required"
        );
      });
    });

    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "invalid-email");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that is long enough."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("email-error")).toHaveTextContent(
          "Email is required"
        );
      });
    });

    it("should show error for message shorter than 20 characters", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(screen.getByTestId("message-input"), "Short msg");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("message-error")).toHaveTextContent(
          "Minimum of length 20 is required"
        );
      });
    });

    it("should show multiple errors for multiple invalid fields", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "Jo");
      await user.type(screen.getByTestId("email-input"), "bad");
      await user.type(screen.getByTestId("message-input"), "Short");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toBeInTheDocument();
        expect(screen.getByTestId("email-error")).toBeInTheDocument();
        expect(screen.getByTestId("message-error")).toBeInTheDocument();
      });
    });

    it("should clear error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      // Trigger validation error
      await user.type(screen.getByTestId("name-input"), "Jo");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that is long enough."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toBeInTheDocument();
      });

      // Type more to fix the error
      await user.type(screen.getByTestId("name-input"), "hn Doe");

      await waitFor(() => {
        expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    it("should submit form with valid data", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          message:
            "This is a test message that meets the minimum length requirement.",
        });
      });
    });

    it("should show success message on successful submission", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toHaveTextContent(
          "Message sent successfully!"
        );
      });
    });

    it("should clear form after successful submission", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("name-input")).toHaveValue("");
        expect(screen.getByTestId("email-input")).toHaveValue("");
        expect(screen.getByTestId("message-input")).toHaveValue("");
      });
    });

    it("should not call onSubmit if validation fails", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockSubmit} />);

      await user.type(screen.getByTestId("name-input"), "Jo");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe("error handling", () => {
    it("should show server error when submission fails", async () => {
      const user = userEvent.setup();
      const failingSubmit = vi
        .fn()
        .mockResolvedValue({ error: "Server error occurred" });
      render(<ContactForm onSubmit={failingSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toHaveTextContent(
          "Server error occurred"
        );
      });
    });

    it("should show generic error when submission throws", async () => {
      const user = userEvent.setup();
      const throwingSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
      render(<ContactForm onSubmit={throwingSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toHaveTextContent(
          "An unexpected error occurred"
        );
      });
    });
  });

  describe("loading state", () => {
    it("should disable form fields during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: { success: boolean }) => void;
      const slowSubmit = vi.fn().mockImplementation(
        () =>
          new Promise<{ success: boolean }>((resolve) => {
            resolveSubmit = resolve;
          })
      );
      render(<ContactForm onSubmit={slowSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("name-input")).toBeDisabled();
      expect(screen.getByTestId("email-input")).toBeDisabled();
      expect(screen.getByTestId("message-input")).toBeDisabled();
      expect(screen.getByTestId("submit-button")).toBeDisabled();

      // Clean up
      resolveSubmit!({ success: true });
    });

    it("should show sending text during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: { success: boolean }) => void;
      const slowSubmit = vi.fn().mockImplementation(
        () =>
          new Promise<{ success: boolean }>((resolve) => {
            resolveSubmit = resolve;
          })
      );
      render(<ContactForm onSubmit={slowSubmit} />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(
        screen.getByTestId("message-input"),
        "This is a test message that meets the minimum length requirement."
      );
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("submit-button")).toHaveTextContent("Sending...");

      // Clean up
      resolveSubmit!({ success: true });
    });
  });
});
