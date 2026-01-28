import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Types for testing
interface TopicSuggestion {
  topic: string;
  description: string;
  relevanceScore: number;
  relatedKeywords: string[];
}

interface TrendingTopic {
  topic: string;
  trendScore: number;
  growth: string;
  category: string;
  searchVolume: string;
  relatedQueries: string[];
}

// Simplified TopicSuggestionsDialog for testing
interface TopicSuggestionsDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTopic: (
    topic: string,
    description: string,
    keywords: string[],
  ) => void;
}

const TopicSuggestionsDialog = ({
  open,
  onClose,
  onSelectTopic,
}: TopicSuggestionsDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<TopicSuggestion[]>([]);
  const [category, setCategory] = React.useState("all");
  const [hasSearched, setHasSearched] = React.useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch("/api/ai/suggest-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      setSuggestions(data.topics || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div data-testid="topic-suggestions-dialog">
      <h2>AI Topic Suggestions</h2>
      <select
        data-testid="category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="technology">Technology</option>
        <option value="programming">Programming</option>
      </select>
      <button
        data-testid="generate-btn"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      {!hasSearched && (
        <div data-testid="initial-state">
          Select a category and click Generate
        </div>
      )}
      {hasSearched && !loading && suggestions.length === 0 && (
        <div data-testid="no-results">No suggestions found</div>
      )}
      {suggestions.length > 0 && (
        <div data-testid="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              data-testid={`suggestion-${index}`}
              onClick={() =>
                onSelectTopic(
                  suggestion.topic,
                  suggestion.description,
                  suggestion.relatedKeywords,
                )
              }
            >
              <span data-testid={`suggestion-title-${index}`}>
                {suggestion.topic}
              </span>
              <span data-testid={`suggestion-score-${index}`}>
                {suggestion.relevanceScore}
              </span>
            </button>
          ))}
        </div>
      )}
      <button data-testid="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

// Simplified TrendingTopicsDialog for testing
interface TrendingTopicsDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string, description: string) => void;
}

const TrendingTopicsDialog = ({
  open,
  onClose,
  onSelectTopic,
}: TrendingTopicsDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const [trends, setTrends] = React.useState<TrendingTopic[]>([]);
  const [category, setCategory] = React.useState("all");
  const [timeframe, setTimeframe] = React.useState("week");
  const [hasSearched, setHasSearched] = React.useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch("/api/ai/trending-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, timeframe }),
      });
      const data = await res.json();
      setTrends(data.trends || []);
    } catch {
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div data-testid="trending-topics-dialog">
      <h2>Discover Trending Topics</h2>
      <select
        data-testid="trend-category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="technology">Technology</option>
        <option value="ai-ml">AI & Machine Learning</option>
      </select>
      <select
        data-testid="timeframe-select"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
      <button
        data-testid="find-trends-btn"
        onClick={fetchTrends}
        disabled={loading}
      >
        {loading ? "Finding..." : "Find Trends"}
      </button>
      {!hasSearched && (
        <div data-testid="trend-initial-state">
          Select filters and click Find Trends
        </div>
      )}
      {hasSearched && !loading && trends.length === 0 && (
        <div data-testid="no-trends">No trends found</div>
      )}
      {trends.length > 0 && (
        <div data-testid="trends-list">
          {trends.map((trend, index) => (
            <button
              key={index}
              data-testid={`trend-${index}`}
              onClick={() => {
                const description = `Trending topic with ${trend.growth} growth. Related: ${trend.relatedQueries.join(", ")}`;
                onSelectTopic(trend.topic, description);
              }}
            >
              <span data-testid={`trend-topic-${index}`}>{trend.topic}</span>
              <span data-testid={`trend-score-${index}`}>
                {trend.trendScore}
              </span>
              <span data-testid={`trend-growth-${index}`}>{trend.growth}</span>
            </button>
          ))}
        </div>
      )}
      <button data-testid="close-trends-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

// Simplified ScriptGenerationDialog for testing
interface ScriptGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onScriptGenerated: (script: string) => void;
  ideaTitle: string;
  ideaDescription?: string;
}

const ScriptGenerationDialog = ({
  open,
  onClose,
  onScriptGenerated,
  ideaTitle,
  ideaDescription,
}: ScriptGenerationDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const [script, setScript] = React.useState("");
  const [tone, setTone] = React.useState("professional");
  const [length, setLength] = React.useState("medium");

  const generateScript = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaDescription,
          tone,
          targetLength: length,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleUseScript = () => {
    onScriptGenerated(script);
    onClose();
  };

  if (!open) return null;

  return (
    <div data-testid="script-generation-dialog">
      <h2>Generate Blog Script</h2>
      <div data-testid="script-title">Title: {ideaTitle}</div>
      <select
        data-testid="tone-select"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="educational">Educational</option>
      </select>
      <select
        data-testid="length-select"
        value={length}
        onChange={(e) => setLength(e.target.value)}
      >
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select>
      <button
        data-testid="generate-script-btn"
        onClick={generateScript}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Script"}
      </button>
      {script && (
        <div data-testid="generated-script">
          <textarea data-testid="script-content" value={script} readOnly />
          <button data-testid="use-script-btn" onClick={handleUseScript}>
            Use This Script
          </button>
        </div>
      )}
      <button data-testid="close-script-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

describe("Ideas AI Dialogs - Functional Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("TopicSuggestionsDialog", () => {
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnSelectTopic: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnClose = vi.fn();
      mockOnSelectTopic = vi.fn();
    });

    it("should render when open", () => {
      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      expect(
        screen.getByTestId("topic-suggestions-dialog"),
      ).toBeInTheDocument();
    });

    it("should not render when closed", () => {
      render(
        <TopicSuggestionsDialog
          open={false}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      expect(
        screen.queryByTestId("topic-suggestions-dialog"),
      ).not.toBeInTheDocument();
    });

    it("should show initial state before generating", () => {
      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      expect(screen.getByTestId("initial-state")).toBeInTheDocument();
    });

    it("should fetch suggestions when generate clicked", async () => {
      const mockSuggestions = [
        {
          topic: "React Hooks",
          description: "Learn about React Hooks",
          relevanceScore: 9,
          relatedKeywords: ["useState", "useEffect"],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ topics: mockSuggestions }),
      });

      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("generate-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("suggestions-list")).toBeInTheDocument();
      });

      expect(screen.getByTestId("suggestion-title-0")).toHaveTextContent(
        "React Hooks",
      );
    });

    it("should show no results message when no suggestions", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ topics: [] }),
      });

      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("generate-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("no-results")).toBeInTheDocument();
      });
    });

    it("should call onSelectTopic when suggestion clicked", async () => {
      const mockSuggestions = [
        {
          topic: "Test Topic",
          description: "Test Description",
          relevanceScore: 8,
          relatedKeywords: ["keyword1", "keyword2"],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ topics: mockSuggestions }),
      });

      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("generate-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("suggestion-0")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("suggestion-0"));

      expect(mockOnSelectTopic).toHaveBeenCalledWith(
        "Test Topic",
        "Test Description",
        ["keyword1", "keyword2"],
      );
    });

    it("should call onClose when close button clicked", () => {
      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("close-btn"));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("TrendingTopicsDialog", () => {
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnSelectTopic: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnClose = vi.fn();
      mockOnSelectTopic = vi.fn();
    });

    it("should render when open", () => {
      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      expect(screen.getByTestId("trending-topics-dialog")).toBeInTheDocument();
    });

    it("should show initial state before searching", () => {
      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      expect(screen.getByTestId("trend-initial-state")).toBeInTheDocument();
    });

    it("should fetch trends when find trends clicked", async () => {
      const mockTrends = [
        {
          topic: "AI Agents",
          trendScore: 95,
          growth: "+450%",
          category: "Technology",
          searchVolume: "Very High",
          relatedQueries: ["AI agent frameworks", "autonomous AI"],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ trends: mockTrends }),
      });

      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("find-trends-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("trends-list")).toBeInTheDocument();
      });

      expect(screen.getByTestId("trend-topic-0")).toHaveTextContent(
        "AI Agents",
      );
      expect(screen.getByTestId("trend-growth-0")).toHaveTextContent("+450%");
    });

    it("should show no trends message when empty", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ trends: [] }),
      });

      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("find-trends-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("no-trends")).toBeInTheDocument();
      });
    });

    it("should allow changing filters", () => {
      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.change(screen.getByTestId("trend-category-select"), {
        target: { value: "technology" },
      });
      fireEvent.change(screen.getByTestId("timeframe-select"), {
        target: { value: "month" },
      });

      expect(screen.getByTestId("trend-category-select")).toHaveValue(
        "technology",
      );
      expect(screen.getByTestId("timeframe-select")).toHaveValue("month");
    });

    it("should call onSelectTopic with formatted description", async () => {
      const mockTrends = [
        {
          topic: "Next.js 15",
          trendScore: 85,
          growth: "+150%",
          category: "Web Development",
          searchVolume: "High",
          relatedQueries: ["Next.js features", "App Router"],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ trends: mockTrends }),
      });

      render(
        <TrendingTopicsDialog
          open={true}
          onClose={mockOnClose}
          onSelectTopic={mockOnSelectTopic}
        />,
      );

      fireEvent.click(screen.getByTestId("find-trends-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("trend-0")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("trend-0"));

      expect(mockOnSelectTopic).toHaveBeenCalledWith(
        "Next.js 15",
        "Trending topic with +150% growth. Related: Next.js features, App Router",
      );
    });
  });

  describe("ScriptGenerationDialog", () => {
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnScriptGenerated: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockOnClose = vi.fn();
      mockOnScriptGenerated = vi.fn();
    });

    it("should render with idea title", () => {
      render(
        <ScriptGenerationDialog
          open={true}
          onClose={mockOnClose}
          onScriptGenerated={mockOnScriptGenerated}
          ideaTitle="Test Blog Post"
        />,
      );

      expect(screen.getByTestId("script-title")).toHaveTextContent(
        "Title: Test Blog Post",
      );
    });

    it("should generate script when button clicked", async () => {
      const mockScript =
        "## Introduction\n\nThis is the generated script content.";

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ script: mockScript }),
      });

      render(
        <ScriptGenerationDialog
          open={true}
          onClose={mockOnClose}
          onScriptGenerated={mockOnScriptGenerated}
          ideaTitle="Test Blog"
        />,
      );

      fireEvent.click(screen.getByTestId("generate-script-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("generated-script")).toBeInTheDocument();
      });

      expect(screen.getByTestId("script-content")).toHaveValue(mockScript);
    });

    it("should allow changing tone and length", () => {
      render(
        <ScriptGenerationDialog
          open={true}
          onClose={mockOnClose}
          onScriptGenerated={mockOnScriptGenerated}
          ideaTitle="Test"
        />,
      );

      fireEvent.change(screen.getByTestId("tone-select"), {
        target: { value: "casual" },
      });
      fireEvent.change(screen.getByTestId("length-select"), {
        target: { value: "long" },
      });

      expect(screen.getByTestId("tone-select")).toHaveValue("casual");
      expect(screen.getByTestId("length-select")).toHaveValue("long");
    });

    it("should call onScriptGenerated when use script clicked", async () => {
      const mockScript = "Generated script content";

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ script: mockScript }),
      });

      render(
        <ScriptGenerationDialog
          open={true}
          onClose={mockOnClose}
          onScriptGenerated={mockOnScriptGenerated}
          ideaTitle="Test"
        />,
      );

      fireEvent.click(screen.getByTestId("generate-script-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("use-script-btn")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("use-script-btn"));

      expect(mockOnScriptGenerated).toHaveBeenCalledWith(mockScript);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("API Error Handling", () => {
    it("should handle fetch error gracefully in topic suggestions", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <TopicSuggestionsDialog
          open={true}
          onClose={vi.fn()}
          onSelectTopic={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByTestId("generate-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("no-results")).toBeInTheDocument();
      });
    });

    it("should handle fetch error gracefully in trending topics", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <TrendingTopicsDialog
          open={true}
          onClose={vi.fn()}
          onSelectTopic={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByTestId("find-trends-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("no-trends")).toBeInTheDocument();
      });
    });
  });
});
