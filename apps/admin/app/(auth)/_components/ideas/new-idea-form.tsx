"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import {
  Loader2,
  Plus,
  X,
  Sparkles,
  TrendingUp,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { createIdea } from "@repo/actions";
import { TrendingTopicsDialog } from "./trending-topics-dialog";
import { TopicSuggestionsDialog } from "./topic-suggestions-dialog";

interface NewIdeaFormProps {
  authorId: string;
}

export function NewIdeaForm({ authorId }: NewIdeaFormProps): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [showTrendingDialog, setShowTrendingDialog] = useState(false);
  const [showTopicSuggestionsDialog, setShowTopicSuggestionsDialog] =
    useState(false);

  const addTopic = (): void => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string): void => {
    setTopics(topics.filter((t) => t !== topic));
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopic();
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    createIdea({
      title: title.trim(),
      description: description.trim() || undefined,
      topics,
      authorId,
    })
      .then((idea) => {
        router.push(`/ideas/${idea.id}`);
      })
      .catch(() => {
        // Failed to create idea
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDescription(e.target.value);
  };

  const handleNewTopicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setNewTopic(e.target.value);
  };

  const handleBack = (): void => {
    router.back();
  };

  const handleShowTrendingDialog = (): void => {
    setShowTrendingDialog(true);
  };

  const handleCloseTrendingDialog = (): void => {
    setShowTrendingDialog(false);
  };

  const handleSelectTrendingTopic = (
    topic: string,
    topicDescription: string,
  ): void => {
    setTitle(topic);
    setDescription(topicDescription);
  };

  const handleShowTopicSuggestionsDialog = (): void => {
    setShowTopicSuggestionsDialog(true);
  };

  const handleCloseTopicSuggestionsDialog = (): void => {
    setShowTopicSuggestionsDialog(false);
  };

  const handleSelectSuggestedTopic = (
    topic: string,
    topicDescription: string,
    keywords: string[],
  ): void => {
    setTitle(topic);
    setDescription(topicDescription);
    setTopics((prev) => Array.from(new Set([...prev, ...keywords])));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create New Idea</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Assist
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleShowTrendingDialog}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Discover Trending Topics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShowTopicSuggestionsDialog}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Topic Suggestions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                onChange={handleTitleChange}
                placeholder="Enter your idea title..."
                required
                value={title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                onChange={handleDescriptionChange}
                placeholder="Describe your idea..."
                rows={4}
                value={description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topics">Topics</Label>
              <div className="flex gap-2">
                <Input
                  id="topics"
                  onChange={handleNewTopicChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a topic..."
                  value={newTopic}
                />
                <Button onClick={addTopic} type="button" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {topics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.map((topic) => (
                    <Badge className="gap-1" key={topic} variant="secondary">
                      {topic}
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={() => {
                          removeTopic(topic);
                        }}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex gap-4 justify-end">
              <Button onClick={handleBack} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={loading || !title.trim()} type="submit">
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Create Idea
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <TrendingTopicsDialog
        onClose={handleCloseTrendingDialog}
        onSelectTopic={handleSelectTrendingTopic}
        open={showTrendingDialog}
      />

      <TopicSuggestionsDialog
        existingTopics={topics}
        onClose={handleCloseTopicSuggestionsDialog}
        onSelectTopic={handleSelectSuggestedTopic}
        open={showTopicSuggestionsDialog}
      />
    </div>
  );
}
