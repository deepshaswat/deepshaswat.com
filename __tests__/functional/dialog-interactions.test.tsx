import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

// Dialog component for testing
interface DialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Dialog = ({
  trigger,
  title,
  description,
  children,
  onOpenChange,
  defaultOpen = false,
}: DialogProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <>
      <button
        onClick={() => handleOpenChange(true)}
        data-testid="dialog-trigger"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          data-testid="dialog-overlay"
          className="overlay"
          onClick={() => handleOpenChange(false)}
        >
          <div
            data-testid="dialog-content"
            className="dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby={description ? "dialog-description" : undefined}
          >
            <button
              onClick={() => handleOpenChange(false)}
              data-testid="dialog-close"
              aria-label="Close dialog"
            >
              ×
            </button>
            <h2 id="dialog-title" data-testid="dialog-title">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" data-testid="dialog-description">
                {description}
              </p>
            )}
            <div data-testid="dialog-body">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

// Confirm dialog for testing
interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div data-testid="confirm-dialog-overlay" className="overlay">
      <div
        data-testid="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title" data-testid="confirm-title">
          {title}
        </h2>
        <p id="confirm-message" data-testid="confirm-message">
          {message}
        </p>
        <div data-testid="confirm-actions">
          <button onClick={onCancel} data-testid="cancel-button">
            {cancelText}
          </button>
          <button onClick={onConfirm} data-testid="confirm-button">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Multi-step dialog for testing
interface Step {
  title: string;
  content: React.ReactNode;
}

interface MultiStepDialogProps {
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MultiStepDialog = ({
  steps,
  isOpen,
  onClose,
  onComplete,
}: MultiStepDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div data-testid="multi-step-overlay" className="overlay">
      <div data-testid="multi-step-dialog" role="dialog" aria-modal="true">
        <button onClick={onClose} data-testid="close-button" aria-label="Close">
          ×
        </button>
        <div data-testid="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
        <h2 data-testid="step-title">{steps[currentStep].title}</h2>
        <div data-testid="step-content">{steps[currentStep].content}</div>
        <div data-testid="step-navigation">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            data-testid="previous-button"
          >
            Previous
          </button>
          <button onClick={handleNext} data-testid="next-button">
            {isLastStep ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

describe("Dialog Interactions - Functional Tests", () => {
  describe("Basic Dialog", () => {
    it("should render trigger button", () => {
      render(
        <Dialog title="Test Dialog" trigger="Open Dialog">
          <p>Dialog content</p>
        </Dialog>
      );

      expect(screen.getByTestId("dialog-trigger")).toHaveTextContent(
        "Open Dialog"
      );
    });

    it("should not show dialog content initially", () => {
      render(
        <Dialog title="Test Dialog" trigger="Open">
          <p>Dialog content</p>
        </Dialog>
      );

      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });

    it("should open dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test Dialog" trigger="Open">
          <p>Dialog content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });

    it("should display dialog title", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="My Dialog Title" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-title")).toHaveTextContent(
        "My Dialog Title"
      );
    });

    it("should display dialog description when provided", async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          title="Title"
          description="This is a description"
          trigger="Open"
        >
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-description")).toHaveTextContent(
        "This is a description"
      );
    });

    it("should close dialog when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();

      await user.click(screen.getByTestId("dialog-close"));
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });

    it("should close dialog when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));
      await user.click(screen.getByTestId("dialog-overlay"));

      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });

    it("should not close when clicking inside dialog content", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));
      await user.click(screen.getByTestId("dialog-body"));

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });

    it("should call onOpenChange when dialog opens", async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();
      render(
        <Dialog title="Test" trigger="Open" onOpenChange={mockOnOpenChange}>
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange when dialog closes", async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();
      render(
        <Dialog title="Test" trigger="Open" onOpenChange={mockOnOpenChange}>
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));
      await user.click(screen.getByTestId("dialog-close"));

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should render with defaultOpen", () => {
      render(
        <Dialog title="Test" trigger="Open" defaultOpen>
          <p>Content</p>
        </Dialog>
      );

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });
  });

  describe("Dialog Accessibility", () => {
    it("should have role dialog", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-content")).toHaveAttribute(
        "role",
        "dialog"
      );
    });

    it("should have aria-modal attribute", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-content")).toHaveAttribute(
        "aria-modal",
        "true"
      );
    });

    it("should have aria-labelledby pointing to title", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-content")).toHaveAttribute(
        "aria-labelledby",
        "dialog-title"
      );
    });

    it("should have close button with aria-label", async () => {
      const user = userEvent.setup();
      render(
        <Dialog title="Test" trigger="Open">
          <p>Content</p>
        </Dialog>
      );

      await user.click(screen.getByTestId("dialog-trigger"));

      expect(screen.getByTestId("dialog-close")).toHaveAttribute(
        "aria-label",
        "Close dialog"
      );
    });
  });

  describe("Confirm Dialog", () => {
    let mockConfirm: ReturnType<typeof vi.fn>;
    let mockCancel: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockConfirm = vi.fn();
      mockCancel = vi.fn();
    });

    it("should not render when not open", () => {
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={false}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });

    it("should render when open", () => {
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
    });

    it("should display title and message", () => {
      render(
        <ConfirmDialog
          title="Delete Item"
          message="This action cannot be undone."
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      expect(screen.getByTestId("confirm-title")).toHaveTextContent(
        "Delete Item"
      );
      expect(screen.getByTestId("confirm-message")).toHaveTextContent(
        "This action cannot be undone."
      );
    });

    it("should call onConfirm when confirm button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      await user.click(screen.getByTestId("confirm-button"));

      expect(mockConfirm).toHaveBeenCalled();
    });

    it("should call onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      await user.click(screen.getByTestId("cancel-button"));

      expect(mockCancel).toHaveBeenCalled();
    });

    it("should use custom button text", () => {
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
          confirmText="Yes, delete"
          cancelText="No, keep it"
        />
      );

      expect(screen.getByTestId("confirm-button")).toHaveTextContent(
        "Yes, delete"
      );
      expect(screen.getByTestId("cancel-button")).toHaveTextContent(
        "No, keep it"
      );
    });

    it("should have alertdialog role", () => {
      render(
        <ConfirmDialog
          title="Confirm"
          message="Are you sure?"
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      );

      expect(screen.getByTestId("confirm-dialog")).toHaveAttribute(
        "role",
        "alertdialog"
      );
    });
  });

  describe("Multi-Step Dialog", () => {
    const mockSteps = [
      { title: "Step 1", content: <p>First step content</p> },
      { title: "Step 2", content: <p>Second step content</p> },
      { title: "Step 3", content: <p>Third step content</p> },
    ];
    let mockClose: ReturnType<typeof vi.fn>;
    let mockComplete: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockClose = vi.fn();
      mockComplete = vi.fn();
    });

    it("should display first step initially", () => {
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 1");
      expect(screen.getByTestId("step-indicator")).toHaveTextContent(
        "Step 1 of 3"
      );
    });

    it("should navigate to next step", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      await user.click(screen.getByTestId("next-button"));

      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 2");
      expect(screen.getByTestId("step-indicator")).toHaveTextContent(
        "Step 2 of 3"
      );
    });

    it("should navigate to previous step", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      await user.click(screen.getByTestId("next-button"));
      await user.click(screen.getByTestId("previous-button"));

      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 1");
    });

    it("should disable previous button on first step", () => {
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      expect(screen.getByTestId("previous-button")).toBeDisabled();
    });

    it("should show Complete button on last step", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      await user.click(screen.getByTestId("next-button"));
      await user.click(screen.getByTestId("next-button"));

      expect(screen.getByTestId("next-button")).toHaveTextContent("Complete");
    });

    it("should call onComplete when clicking Complete on last step", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      // Navigate to last step
      await user.click(screen.getByTestId("next-button"));
      await user.click(screen.getByTestId("next-button"));
      await user.click(screen.getByTestId("next-button")); // This should trigger complete

      expect(mockComplete).toHaveBeenCalled();
    });

    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      await user.click(screen.getByTestId("close-button"));

      expect(mockClose).toHaveBeenCalled();
    });

    it("should complete full wizard flow", async () => {
      const user = userEvent.setup();
      render(
        <MultiStepDialog
          steps={mockSteps}
          isOpen={true}
          onClose={mockClose}
          onComplete={mockComplete}
        />
      );

      // Step 1
      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 1");
      await user.click(screen.getByTestId("next-button"));

      // Step 2
      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 2");
      await user.click(screen.getByTestId("next-button"));

      // Step 3
      expect(screen.getByTestId("step-title")).toHaveTextContent("Step 3");
      await user.click(screen.getByTestId("next-button"));

      // Complete
      expect(mockComplete).toHaveBeenCalled();
    });
  });
});
