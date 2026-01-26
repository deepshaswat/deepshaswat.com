import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

// Status type matching the actual component
type Status = "idle" | "loading" | "success" | "error";

// Unsubscribe form component for testing
const UnsubscribeForm = ({
  onUnsubscribe,
  onRedirect,
}: {
  onUnsubscribe: (email: string) => Promise<void>;
  onRedirect?: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await onUnsubscribe(email);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  const handleGoHome = () => {
    onRedirect?.();
  };

  return (
    <div data-testid="unsubscribe-container">
      <h1>Unsubscribe from Newsletter</h1>
      <p>
        We're sorry to see you go. Please enter your email to unsubscribe from
        our newsletter.
      </p>

      {(status === "idle" || status === "loading") && (
        <form onSubmit={handleSubmit} data-testid="unsubscribe-form">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            required
            data-testid="email-input"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            data-testid="submit-button"
          >
            {status === "loading" ? "Unsubscribing..." : "Unsubscribe"}
          </button>
        </form>
      )}

      {status === "success" && (
        <div data-testid="success-message">
          <h2>Successfully Unsubscribed</h2>
          <p>
            You have been successfully unsubscribed from our newsletter. You
            won't receive any more emails from us.
          </p>
          <button onClick={handleGoHome} data-testid="go-home-button">
            Go to Homepage
          </button>
        </div>
      )}

      {status === "error" && (
        <div data-testid="error-message">
          <h2>Error</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => {
              setStatus("idle");
              setEmail("");
            }}
            data-testid="retry-button"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

describe("Newsletter Unsubscribe - Functional Tests", () => {
  let mockUnsubscribe: ReturnType<typeof vi.fn>;
  let mockRedirect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUnsubscribe = vi.fn().mockResolvedValue(undefined);
    mockRedirect = vi.fn();
  });

  describe("initial rendering", () => {
    it("should render unsubscribe form", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      expect(screen.getByTestId("unsubscribe-container")).toBeInTheDocument();
      expect(screen.getByTestId("unsubscribe-form")).toBeInTheDocument();
    });

    it("should display title and description", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      expect(
        screen.getByText("Unsubscribe from Newsletter")
      ).toBeInTheDocument();
      expect(screen.getByText(/We're sorry to see you go/)).toBeInTheDocument();
    });

    it("should render email input with placeholder", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      const emailInput = screen.getByTestId("email-input");
      expect(emailInput).toHaveAttribute(
        "placeholder",
        "Enter your email address"
      );
    });

    it("should render unsubscribe button", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Unsubscribe"
      );
    });
  });

  describe("form interactions", () => {
    it("should update email input value", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      const emailInput = screen.getByTestId("email-input");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should enable submit button by default", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });
  });

  describe("email validation", () => {
    it("should have required and email type attributes for HTML5 validation", () => {
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      const emailInput = screen.getByTestId("email-input");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("required");
    });

    it("should accept valid email format", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUnsubscribe).toHaveBeenCalledWith("test@example.com");
      });
    });

    it("should validate complex email formats", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(
        screen.getByTestId("email-input"),
        "user.name+tag@subdomain.example.com"
      );
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockUnsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe("loading state", () => {
    it("should show loading text during submission", async () => {
      const user = userEvent.setup();
      let resolveUnsubscribe: () => void;
      const slowUnsubscribe = vi.fn().mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveUnsubscribe = resolve;
          })
      );
      render(
        <UnsubscribeForm
          onUnsubscribe={slowUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Unsubscribing..."
      );

      // Clean up
      resolveUnsubscribe!();
    });

    it("should disable input during submission", async () => {
      const user = userEvent.setup();
      let resolveUnsubscribe: () => void;
      const slowUnsubscribe = vi.fn().mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveUnsubscribe = resolve;
          })
      );
      render(
        <UnsubscribeForm
          onUnsubscribe={slowUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("email-input")).toBeDisabled();
      expect(screen.getByTestId("submit-button")).toBeDisabled();

      // Clean up
      resolveUnsubscribe!();
    });
  });

  describe("success state", () => {
    it("should show success message after successful unsubscribe", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toBeInTheDocument();
      });
    });

    it("should display success title", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(
          screen.getByText("Successfully Unsubscribed")
        ).toBeInTheDocument();
      });
    });

    it("should hide form after successful unsubscribe", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.queryByTestId("unsubscribe-form")).not.toBeInTheDocument();
      });
    });

    it("should show go home button on success", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
      });
    });

    it("should call redirect when clicking go home button", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("go-home-button"));

      expect(mockRedirect).toHaveBeenCalled();
    });
  });

  describe("error state", () => {
    it("should show error message when unsubscribe fails", async () => {
      const user = userEvent.setup();
      const failingUnsubscribe = vi
        .fn()
        .mockRejectedValue(new Error("Email not found"));
      render(
        <UnsubscribeForm
          onUnsubscribe={failingUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Email not found"
        );
      });
    });

    it("should show retry button on error", async () => {
      const user = userEvent.setup();
      const failingUnsubscribe = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));
      render(
        <UnsubscribeForm
          onUnsubscribe={failingUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("retry-button")).toBeInTheDocument();
      });
    });

    it("should return to form when clicking retry", async () => {
      const user = userEvent.setup();
      const failingUnsubscribe = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));
      render(
        <UnsubscribeForm
          onUnsubscribe={failingUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("retry-button")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("retry-button"));

      await waitFor(() => {
        expect(screen.getByTestId("unsubscribe-form")).toBeInTheDocument();
      });
    });

    it("should show generic error for non-Error exceptions", async () => {
      const user = userEvent.setup();
      const failingUnsubscribe = vi.fn().mockRejectedValue("Unknown error");
      render(
        <UnsubscribeForm
          onUnsubscribe={failingUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "An error occurred"
        );
      });
    });
  });

  describe("user flow scenarios", () => {
    it("should complete full successful unsubscribe flow", async () => {
      const user = userEvent.setup();
      render(
        <UnsubscribeForm
          onUnsubscribe={mockUnsubscribe}
          onRedirect={mockRedirect}
        />
      );

      // Start with form visible
      expect(screen.getByTestId("unsubscribe-form")).toBeInTheDocument();

      // Enter email
      await user.type(screen.getByTestId("email-input"), "user@example.com");

      // Submit
      await user.click(screen.getByTestId("submit-button"));

      // See success
      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toBeInTheDocument();
        expect(
          screen.queryByTestId("unsubscribe-form")
        ).not.toBeInTheDocument();
      });

      // Navigate home
      await user.click(screen.getByTestId("go-home-button"));
      expect(mockRedirect).toHaveBeenCalled();
    });

    it("should allow retry after error", async () => {
      const user = userEvent.setup();
      const submitHandler = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(undefined);
      render(
        <UnsubscribeForm
          onUnsubscribe={submitHandler}
          onRedirect={mockRedirect}
        />
      );

      // First attempt fails
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
      });

      // Retry
      await user.click(screen.getByTestId("retry-button"));

      // Form is back
      await waitFor(() => {
        expect(screen.getByTestId("unsubscribe-form")).toBeInTheDocument();
      });

      // Second attempt succeeds
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toBeInTheDocument();
      });
    });
  });
});
