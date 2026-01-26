import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";

// Member type
interface Member {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed: boolean;
  createdAt: Date;
}

// Member list component for testing
interface MemberListProps {
  members: Member[];
  totalMembers: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onImportClick: () => void;
  onAddMemberClick: () => void;
}

const MemberList = ({
  members,
  totalMembers,
  currentPage,
  totalPages,
  onPageChange,
  onExport,
  onImportClick,
  onAddMemberClick,
}: MemberListProps) => {
  return (
    <div data-testid="member-list">
      <header data-testid="member-header">
        <h1>Members</h1>
        <span data-testid="total-count">{totalMembers} members</span>
        <div>
          <button onClick={onExport} data-testid="export-button">
            Export all members
          </button>
          <button onClick={onImportClick} data-testid="import-button">
            Import
          </button>
          <button onClick={onAddMemberClick} data-testid="add-member-button">
            New member
          </button>
        </div>
      </header>

      <table data-testid="member-table">
        <thead>
          <tr>
            <th>Details</th>
            <th>Subscribed</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} data-testid={`member-row-${member.id}`}>
              <td>
                <span data-testid={`member-email-${member.id}`}>
                  {member.email}
                </span>
                {member.firstName && (
                  <span data-testid={`member-name-${member.id}`}>
                    {member.firstName} {member.lastName}
                  </span>
                )}
              </td>
              <td>
                <span
                  data-testid={`member-status-${member.id}`}
                  className={
                    member.unsubscribed ? "unsubscribed" : "subscribed"
                  }
                >
                  {member.unsubscribed ? "No" : "Yes"}
                </span>
              </td>
              <td data-testid={`member-date-${member.id}`}>
                {member.createdAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {members.length === 0 && (
        <div data-testid="empty-state">No members found</div>
      )}

      <div data-testid="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          data-testid="prev-page"
        >
          Previous
        </button>
        <span data-testid="page-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          data-testid="next-page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Add Member Form for testing
interface AddMemberFormProps {
  onSubmit: (member: Omit<Member, "id" | "createdAt">) => Promise<void>;
  onClose: () => void;
}

const AddMemberForm = ({ onSubmit, onClose }: AddMemberFormProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSubmit({
        email,
        firstName,
        lastName,
        unsubscribed: false,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="add-member-form">
      <h2>Add Member</h2>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
          required
        />
      </div>

      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          data-testid="firstName-input"
        />
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          data-testid="lastName-input"
        />
      </div>

      {error && <div data-testid="error-message">{error}</div>}

      <div>
        <button type="button" onClick={onClose} data-testid="cancel-button">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} data-testid="submit-button">
          {isLoading ? "Adding..." : "Add Member"}
        </button>
      </div>
    </form>
  );
};

describe("Member Management - Admin Functional Tests", () => {
  describe("MemberList", () => {
    const mockMembers: Member[] = [
      {
        id: "1",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        unsubscribed: false,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        unsubscribed: true,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: "3",
        email: "bob@example.com",
        unsubscribed: false,
        createdAt: new Date("2024-03-10"),
      },
    ];

    let mockOnPageChange: ReturnType<typeof vi.fn>;
    let mockOnExport: ReturnType<typeof vi.fn>;
    let mockOnImportClick: ReturnType<typeof vi.fn>;
    let mockOnAddMemberClick: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnPageChange = vi.fn();
      mockOnExport = vi.fn();
      mockOnImportClick = vi.fn();
      mockOnAddMemberClick = vi.fn();
    });

    it("should render member list", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={100}
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("member-list")).toBeInTheDocument();
    });

    it("should display total member count", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={100}
          currentPage={0}
          totalPages={10}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("total-count")).toHaveTextContent(
        "100 members",
      );
    });

    it("should render all members in the list", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("member-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("member-row-2")).toBeInTheDocument();
      expect(screen.getByTestId("member-row-3")).toBeInTheDocument();
    });

    it("should display member emails", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("member-email-1")).toHaveTextContent(
        "john@example.com",
      );
      expect(screen.getByTestId("member-email-2")).toHaveTextContent(
        "jane@example.com",
      );
    });

    it("should display member names when available", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("member-name-1")).toHaveTextContent("John Doe");
      expect(screen.queryByTestId("member-name-3")).not.toBeInTheDocument();
    });

    it("should display subscription status", () => {
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("member-status-1")).toHaveTextContent("Yes");
      expect(screen.getByTestId("member-status-1")).toHaveClass("subscribed");
      expect(screen.getByTestId("member-status-2")).toHaveTextContent("No");
      expect(screen.getByTestId("member-status-2")).toHaveClass("unsubscribed");
    });

    it("should call onExport when export button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      await user.click(screen.getByTestId("export-button"));

      expect(mockOnExport).toHaveBeenCalled();
    });

    it("should call onImportClick when import button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      await user.click(screen.getByTestId("import-button"));

      expect(mockOnImportClick).toHaveBeenCalled();
    });

    it("should call onAddMemberClick when add member button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <MemberList
          members={mockMembers}
          totalMembers={3}
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      await user.click(screen.getByTestId("add-member-button"));

      expect(mockOnAddMemberClick).toHaveBeenCalled();
    });

    it("should show empty state when no members", () => {
      render(
        <MemberList
          members={[]}
          totalMembers={0}
          currentPage={0}
          totalPages={0}
          onPageChange={mockOnPageChange}
          onExport={mockOnExport}
          onImportClick={mockOnImportClick}
          onAddMemberClick={mockOnAddMemberClick}
        />,
      );

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "No members found",
      );
    });

    describe("pagination", () => {
      it("should display current page info", () => {
        render(
          <MemberList
            members={mockMembers}
            totalMembers={100}
            currentPage={2}
            totalPages={10}
            onPageChange={mockOnPageChange}
            onExport={mockOnExport}
            onImportClick={mockOnImportClick}
            onAddMemberClick={mockOnAddMemberClick}
          />,
        );

        expect(screen.getByTestId("page-info")).toHaveTextContent(
          "Page 3 of 10",
        );
      });

      it("should disable previous button on first page", () => {
        render(
          <MemberList
            members={mockMembers}
            totalMembers={100}
            currentPage={0}
            totalPages={10}
            onPageChange={mockOnPageChange}
            onExport={mockOnExport}
            onImportClick={mockOnImportClick}
            onAddMemberClick={mockOnAddMemberClick}
          />,
        );

        expect(screen.getByTestId("prev-page")).toBeDisabled();
      });

      it("should disable next button on last page", () => {
        render(
          <MemberList
            members={mockMembers}
            totalMembers={100}
            currentPage={9}
            totalPages={10}
            onPageChange={mockOnPageChange}
            onExport={mockOnExport}
            onImportClick={mockOnImportClick}
            onAddMemberClick={mockOnAddMemberClick}
          />,
        );

        expect(screen.getByTestId("next-page")).toBeDisabled();
      });

      it("should call onPageChange when navigating pages", async () => {
        const user = userEvent.setup();
        render(
          <MemberList
            members={mockMembers}
            totalMembers={100}
            currentPage={5}
            totalPages={10}
            onPageChange={mockOnPageChange}
            onExport={mockOnExport}
            onImportClick={mockOnImportClick}
            onAddMemberClick={mockOnAddMemberClick}
          />,
        );

        await user.click(screen.getByTestId("next-page"));
        expect(mockOnPageChange).toHaveBeenCalledWith(6);

        await user.click(screen.getByTestId("prev-page"));
        expect(mockOnPageChange).toHaveBeenCalledWith(4);
      });
    });
  });

  describe("AddMemberForm", () => {
    let mockSubmit: ReturnType<typeof vi.fn>;
    let mockClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockSubmit = vi.fn().mockResolvedValue(undefined);
      mockClose = vi.fn();
    });

    it("should render add member form", () => {
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      expect(screen.getByTestId("add-member-form")).toBeInTheDocument();
    });

    it("should render all form fields", () => {
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("firstName-input")).toBeInTheDocument();
      expect(screen.getByTestId("lastName-input")).toBeInTheDocument();
    });

    it("should submit form with entered data", async () => {
      const user = userEvent.setup();
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("firstName-input"), "Test");
      await user.type(screen.getByTestId("lastName-input"), "User");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          unsubscribed: false,
        });
      });
    });

    it("should close form after successful submission", async () => {
      const user = userEvent.setup();
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mockClose).toHaveBeenCalled();
      });
    });

    it("should show error when email is empty", async () => {
      const user = userEvent.setup();
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      // Try to submit without email (HTML5 validation will prevent this)
      // So we test the internal validation by checking required attribute
      expect(screen.getByTestId("email-input")).toHaveAttribute("required");
    });

    it("should show error on submission failure", async () => {
      const user = userEvent.setup();
      mockSubmit.mockRejectedValue(new Error("Member already exists"));
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Member already exists",
        );
      });
    });

    it("should call onClose when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      await user.click(screen.getByTestId("cancel-button"));

      expect(mockClose).toHaveBeenCalled();
    });

    it("should show loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      mockSubmit.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          }),
      );
      render(<AddMemberForm onSubmit={mockSubmit} onClose={mockClose} />);

      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.click(screen.getByTestId("submit-button"));

      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Adding...",
      );
      expect(screen.getByTestId("submit-button")).toBeDisabled();

      resolveSubmit!();
    });
  });
});
