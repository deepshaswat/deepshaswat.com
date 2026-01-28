import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Mock the actions
vi.mock("@repo/actions", () => ({
  createIdea: vi.fn(),
  fetchIdeas: vi.fn(),
  fetchIdeaById: vi.fn(),
  updateIdea: vi.fn(),
  deleteIdea: vi.fn(),
  convertIdeaToDraft: vi.fn(),
  createAuthor: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Types for testing
interface IdeaType {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  status: "NEW" | "IN_PROGRESS" | "DRAFT_CREATED" | "ARCHIVED";
  generatedOutline: string | null;
  createdPostId: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified IdeaCard component for testing
interface IdeaCardProps {
  idea: IdeaType;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const IdeaCard = ({ idea, onSelect, onDelete }: IdeaCardProps) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "NEW":
        return "bg-blue-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "DRAFT_CREATED":
        return "bg-green-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      data-testid={`idea-card-${idea.id}`}
      className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
      onClick={() => onSelect(idea.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(idea.id);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <h3 data-testid={`idea-title-${idea.id}`} className="font-medium">
          {idea.title}
        </h3>
        <span
          data-testid={`idea-status-${idea.id}`}
          className={`px-2 py-1 text-xs rounded ${getStatusColor(idea.status)}`}
        >
          {idea.status}
        </span>
      </div>
      {idea.description && (
        <p
          data-testid={`idea-description-${idea.id}`}
          className="text-sm text-muted-foreground mt-1"
        >
          {idea.description}
        </p>
      )}
      {idea.topics.length > 0 && (
        <div data-testid={`idea-topics-${idea.id}`} className="flex gap-1 mt-2">
          {idea.topics.map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs bg-secondary rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
      <button
        data-testid={`delete-idea-${idea.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(idea.id);
        }}
        className="mt-2 text-destructive text-sm"
      >
        Delete
      </button>
    </div>
  );
};

// Simplified IdeasList component for testing
interface IdeasListProps {
  ideas: IdeaType[];
  onSelectIdea: (id: string) => void;
  onDeleteIdea: (id: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const IdeasList = ({
  ideas,
  onSelectIdea,
  onDeleteIdea,
  statusFilter = "all",
  onStatusFilterChange,
}: IdeasListProps) => {
  const filteredIdeas =
    statusFilter === "all"
      ? ideas
      : ideas.filter((idea) => idea.status === statusFilter);

  return (
    <div data-testid="ideas-list">
      <div data-testid="ideas-filter" className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange?.(e.target.value)}
          data-testid="status-filter-select"
        >
          <option value="all">All Ideas</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DRAFT_CREATED">Draft Created</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div data-testid="ideas-count" className="mb-2">
        {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"}
      </div>
      {filteredIdeas.length === 0 ? (
        <div data-testid="empty-state">No ideas found</div>
      ) : (
        <div className="space-y-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelect={onSelectIdea}
              onDelete={onDeleteIdea}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Simplified NewIdeaForm component for testing
interface NewIdeaFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    topics: string[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NewIdeaForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
}: NewIdeaFormProps) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [topics, setTopics] = React.useState<string[]>([]);
  const [newTopic, setNewTopic] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description, topics });
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="new-idea-form">
      <div className="space-y-4">
        <div>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            data-testid="idea-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter idea title"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            data-testid="idea-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea"
          />
        </div>
        <div>
          <label htmlFor="topics">Topics</label>
          <div className="flex gap-2">
            <input
              id="topics"
              data-testid="idea-topic-input"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a topic"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTopic();
                }
              }}
            />
            <button
              type="button"
              data-testid="add-topic-btn"
              onClick={addTopic}
            >
              Add
            </button>
          </div>
          {topics.length > 0 && (
            <div data-testid="topics-list" className="flex gap-2 mt-2">
              {topics.map((topic) => (
                <span key={topic} className="flex items-center gap-1">
                  {topic}
                  <button
                    type="button"
                    data-testid={`remove-topic-${topic}`}
                    onClick={() => removeTopic(topic)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 justify-end">
          <button type="button" data-testid="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            data-testid="submit-btn"
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? "Creating..." : "Create Idea"}
          </button>
        </div>
      </div>
    </form>
  );
};

describe("Ideas Management - Admin Functional Tests", () => {
  const mockIdeas: IdeaType[] = [
    {
      id: "idea-1",
      title: "React Best Practices",
      description: "A comprehensive guide to React patterns",
      topics: ["react", "javascript"],
      status: "NEW",
      generatedOutline: null,
      createdPostId: null,
      authorId: "author-1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "idea-2",
      title: "TypeScript Tips",
      description: "Advanced TypeScript techniques",
      topics: ["typescript"],
      status: "IN_PROGRESS",
      generatedOutline: "## Introduction\n## Tips",
      createdPostId: null,
      authorId: "author-1",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "idea-3",
      title: "Next.js Guide",
      description: null,
      topics: [],
      status: "DRAFT_CREATED",
      generatedOutline: null,
      createdPostId: "post-1",
      authorId: "author-1",
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
    },
  ];

  describe("IdeaCard Component", () => {
    let mockOnSelect: ReturnType<typeof vi.fn>;
    let mockOnDelete: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnSelect = vi.fn();
      mockOnDelete = vi.fn();
    });

    it("should render idea card with title", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByTestId("idea-title-idea-1")).toHaveTextContent(
        "React Best Practices",
      );
    });

    it("should render idea card with status badge", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByTestId("idea-status-idea-1")).toHaveTextContent("NEW");
    });

    it("should render description when present", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByTestId("idea-description-idea-1")).toHaveTextContent(
        "A comprehensive guide to React patterns",
      );
    });

    it("should not render description when null", () => {
      render(
        <IdeaCard
          idea={mockIdeas[2]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.queryByTestId("idea-description-idea-3"),
      ).not.toBeInTheDocument();
    });

    it("should render topics when present", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      const topicsContainer = screen.getByTestId("idea-topics-idea-1");
      expect(topicsContainer).toHaveTextContent("react");
      expect(topicsContainer).toHaveTextContent("javascript");
    });

    it("should not render topics container when empty", () => {
      render(
        <IdeaCard
          idea={mockIdeas[2]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.queryByTestId("idea-topics-idea-3"),
      ).not.toBeInTheDocument();
    });

    it("should call onSelect when card is clicked", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      fireEvent.click(screen.getByTestId("idea-card-idea-1"));

      expect(mockOnSelect).toHaveBeenCalledWith("idea-1");
    });

    it("should call onDelete when delete button is clicked", () => {
      render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );

      fireEvent.click(screen.getByTestId("delete-idea-idea-1"));

      expect(mockOnDelete).toHaveBeenCalledWith("idea-1");
      expect(mockOnSelect).not.toHaveBeenCalled(); // Should not trigger select
    });

    it("should display correct status color class", () => {
      const { rerender } = render(
        <IdeaCard
          idea={mockIdeas[0]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );
      expect(screen.getByTestId("idea-status-idea-1")).toHaveClass(
        "bg-blue-500",
      );

      rerender(
        <IdeaCard
          idea={mockIdeas[1]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );
      expect(screen.getByTestId("idea-status-idea-2")).toHaveClass(
        "bg-yellow-500",
      );

      rerender(
        <IdeaCard
          idea={mockIdeas[2]}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />,
      );
      expect(screen.getByTestId("idea-status-idea-3")).toHaveClass(
        "bg-green-500",
      );
    });
  });

  describe("IdeasList Component", () => {
    let mockOnSelect: ReturnType<typeof vi.fn>;
    let mockOnDelete: ReturnType<typeof vi.fn>;
    let mockOnFilterChange: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnSelect = vi.fn();
      mockOnDelete = vi.fn();
      mockOnFilterChange = vi.fn();
    });

    it("should render all ideas when no filter applied", () => {
      render(
        <IdeasList
          ideas={mockIdeas}
          onSelectIdea={mockOnSelect}
          onDeleteIdea={mockOnDelete}
          onStatusFilterChange={mockOnFilterChange}
        />,
      );

      expect(screen.getByTestId("ideas-count")).toHaveTextContent("3 ideas");
      expect(screen.getByTestId("idea-card-idea-1")).toBeInTheDocument();
      expect(screen.getByTestId("idea-card-idea-2")).toBeInTheDocument();
      expect(screen.getByTestId("idea-card-idea-3")).toBeInTheDocument();
    });

    it("should filter ideas by status", () => {
      render(
        <IdeasList
          ideas={mockIdeas}
          onSelectIdea={mockOnSelect}
          onDeleteIdea={mockOnDelete}
          statusFilter="NEW"
          onStatusFilterChange={mockOnFilterChange}
        />,
      );

      expect(screen.getByTestId("ideas-count")).toHaveTextContent("1 idea");
      expect(screen.getByTestId("idea-card-idea-1")).toBeInTheDocument();
      expect(screen.queryByTestId("idea-card-idea-2")).not.toBeInTheDocument();
    });

    it("should show empty state when no ideas match filter", () => {
      render(
        <IdeasList
          ideas={mockIdeas}
          onSelectIdea={mockOnSelect}
          onDeleteIdea={mockOnDelete}
          statusFilter="ARCHIVED"
          onStatusFilterChange={mockOnFilterChange}
        />,
      );

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "No ideas found",
      );
    });

    it("should call onStatusFilterChange when filter changes", () => {
      render(
        <IdeasList
          ideas={mockIdeas}
          onSelectIdea={mockOnSelect}
          onDeleteIdea={mockOnDelete}
          onStatusFilterChange={mockOnFilterChange}
        />,
      );

      fireEvent.change(screen.getByTestId("status-filter-select"), {
        target: { value: "IN_PROGRESS" },
      });

      expect(mockOnFilterChange).toHaveBeenCalledWith("IN_PROGRESS");
    });

    it("should show empty state when ideas array is empty", () => {
      render(
        <IdeasList
          ideas={[]}
          onSelectIdea={mockOnSelect}
          onDeleteIdea={mockOnDelete}
          onStatusFilterChange={mockOnFilterChange}
        />,
      );

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByTestId("ideas-count")).toHaveTextContent("0 ideas");
    });
  });

  describe("NewIdeaForm Component", () => {
    let mockOnSubmit: ReturnType<typeof vi.fn>;
    let mockOnCancel: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnSubmit = vi.fn();
      mockOnCancel = vi.fn();
    });

    it("should render form with all fields", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByTestId("idea-title-input")).toBeInTheDocument();
      expect(screen.getByTestId("idea-description-input")).toBeInTheDocument();
      expect(screen.getByTestId("idea-topic-input")).toBeInTheDocument();
    });

    it("should disable submit button when title is empty", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByTestId("submit-btn")).toBeDisabled();
    });

    it("should enable submit button when title is provided", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-title-input"), {
        target: { value: "New Idea" },
      });

      expect(screen.getByTestId("submit-btn")).not.toBeDisabled();
    });

    it("should submit form with correct data", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-title-input"), {
        target: { value: "My New Idea" },
      });
      fireEvent.change(screen.getByTestId("idea-description-input"), {
        target: { value: "A great idea" },
      });
      fireEvent.click(screen.getByTestId("submit-btn"));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "My New Idea",
        description: "A great idea",
        topics: [],
      });
    });

    it("should add topics correctly", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "javascript" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));

      expect(screen.getByTestId("topics-list")).toHaveTextContent("javascript");
    });

    it("should not add duplicate topics", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "javascript" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));
      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "javascript" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));

      const topicsList = screen.getByTestId("topics-list");
      expect(topicsList.textContent?.match(/javascript/g)?.length).toBe(1);
    });

    it("should remove topics correctly", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "javascript" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));
      fireEvent.click(screen.getByTestId("remove-topic-javascript"));

      expect(screen.queryByTestId("topics-list")).not.toBeInTheDocument();
    });

    it("should add topic on Enter key press", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const topicInput = screen.getByTestId("idea-topic-input");
      fireEvent.change(topicInput, { target: { value: "react" } });
      fireEvent.keyDown(topicInput, { key: "Enter" });

      expect(screen.getByTestId("topics-list")).toHaveTextContent("react");
    });

    it("should call onCancel when cancel button clicked", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.click(screen.getByTestId("cancel-btn"));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("should show loading state", () => {
      render(
        <NewIdeaForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isLoading={true}
        />,
      );

      expect(screen.getByTestId("submit-btn")).toHaveTextContent("Creating...");
      expect(screen.getByTestId("submit-btn")).toBeDisabled();
    });

    it("should include topics in submission", () => {
      render(<NewIdeaForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByTestId("idea-title-input"), {
        target: { value: "Test Idea" },
      });
      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "react" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));
      fireEvent.change(screen.getByTestId("idea-topic-input"), {
        target: { value: "typescript" },
      });
      fireEvent.click(screen.getByTestId("add-topic-btn"));
      fireEvent.click(screen.getByTestId("submit-btn"));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Idea",
        description: "",
        topics: ["react", "typescript"],
      });
    });
  });

  describe("Status Workflow", () => {
    it("should display correct status progression", () => {
      const statuses = [
        "NEW",
        "IN_PROGRESS",
        "DRAFT_CREATED",
        "ARCHIVED",
      ] as const;

      statuses.forEach((status) => {
        const idea: IdeaType = {
          ...mockIdeas[0],
          id: `idea-${status}`,
          status,
        };

        const { unmount } = render(
          <IdeaCard idea={idea} onSelect={vi.fn()} onDelete={vi.fn()} />,
        );

        expect(
          screen.getByTestId(`idea-status-idea-${status}`),
        ).toHaveTextContent(status);
        unmount();
      });
    });
  });
});
