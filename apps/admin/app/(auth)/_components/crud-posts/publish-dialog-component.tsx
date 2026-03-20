"use client";

import {
  dateTimeValidation,
  publishPost,
  searchSubscribersForSend,
  resendNewsletter,
} from "@repo/actions";
import {
  selectDate,
  postDataState,
  selectedTimeIst,
  postIdState,
  savePostErrorState,
  totalMembersState,
  postState,
} from "@repo/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  DatePicker,
  Label,
  RadioGroup,
  RadioGroupItem,
  useNewsletterMarkdown,
  BlockNoteRenderer,
  Input,
  Badge,
} from "@repo/ui";
import {
  ChevronLeft,
  ArrowRight,
  Calendar,
  Zap,
  FileText,
  Mail,
  Check,
  Eye,
  Users,
  User,
  X,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

interface PublishDialogProps {
  value: boolean;
  onOpenChange: (value: boolean) => void;
  mode?: "publish" | "resend";
}

function PublishDialog({
  value,
  onOpenChange,
  mode = "publish",
}: PublishDialogProps): JSX.Element {
  const router = useRouter();

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(
    mode === "resend" ? false : value,
  );
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(
    mode === "resend" ? value : false,
  );
  const [finalTime, setFinalTime] = useState<Date | null>(null);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [publishType, setPublishType] = useState<"blog" | "newsletter">(
    mode === "resend" ? "newsletter" : "blog",
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [_error, setError] = useRecoilState(savePostErrorState);

  // Individual sending state
  const [sendMode, setSendMode] = useState<"all" | "individual">("all");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { email: string; name: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inputDate, setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, setInputTimeIst] = useRecoilState(selectedTimeIst);
  const totalMembers = useRecoilValue(totalMembersState);

  const postId = useRecoilValue(postIdState);
  const post = useRecoilValue(postDataState);
  const currentPost = useRecoilValue(postState);

  // Compute merged values from post (can be null) and currentPost (fallback)
  // post can be null at runtime - the Recoil state type is PostListType | null
  /* eslint-disable @typescript-eslint/no-unnecessary-condition -- postDataState has type PostListType | null, so post can be null at runtime even though ESLint's type inference disagrees */
  const postTitle = post?.title ?? currentPost.title ?? "Untitled";
  const postContent = post?.content ?? currentPost.content ?? "";
  const postFeatureImage = post?.featureImage ?? currentPost.featureImage ?? "";
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */

  const { markdown: newsletterMarkdown, NewsletterMarkdown } =
    useNewsletterMarkdown(postContent);

  const handleContinueToPreview = (): void => {
    setError(null);
    setIsFirstDialogOpen(false);
    setIsPreviewDialogOpen(true);
  };

  const handleContinueToConfirm = async (): Promise<void> => {
    const timeValidation = await dateTimeValidation(inputDate, inputTimeIst);

    if (timeValidation.error && scheduleType === "later") {
      setError(timeValidation.error);
      return;
    }

    if (timeValidation.combinedDate) {
      setFinalTime(timeValidation.combinedDate);
    }

    setError(null);
    setIsPreviewDialogOpen(false);
    setIsSecondDialogOpen(true);
  };

  const handleBackToSettings = (): void => {
    setIsSecondDialogOpen(false);
    setIsPreviewDialogOpen(true);
  };

  const handleBackToSettingsFromPreview = (): void => {
    setIsPreviewDialogOpen(false);
    setIsFirstDialogOpen(true);
  };

  const handleCloseFirstDialog = (): void => {
    setIsFirstDialogOpen(false);
  };

  const handleScheduleChange = (val: string): void => {
    setScheduleType(val as "now" | "later");
  };

  const handlePublishTypeChange = (val: string): void => {
    setPublishType(val as "blog" | "newsletter");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputTimeIst(e.target.value);
  };

  const handlePublish = async (): Promise<void> => {
    if (!postId) {
      setError("Post ID is required");
      return;
    }

    if (!post) {
      setError("Post data is required");
      return;
    }

    setIsPublishing(true);

    try {
      // Resend mode: use resendNewsletter action
      if (mode === "resend") {
        const emails = sendMode === "individual" ? selectedEmails : undefined;
        const result = await resendNewsletter(postId, emails);

        if (result.success) {
          setIsSecondDialogOpen(false);
          onOpenChange(false);
        } else {
          setError(result.error || "Failed to resend newsletter");
        }
        return;
      }

      // Publish mode
      const markdown = publishType === "newsletter" ? newsletterMarkdown : "";

      let publishTime = finalTime;
      if (scheduleType === "now") {
        publishTime = new Date();
      }

      if (!publishTime) {
        setError("Publish time is required");
        setIsPublishing(false);
        return;
      }

      const individualEmails =
        publishType === "newsletter" && sendMode === "individual"
          ? selectedEmails
          : undefined;

      const result = await publishPost(
        postId,
        publishTime,
        scheduleType,
        publishType,
        post,
        markdown,
        individualEmails,
      );

      if (result.success) {
        setIsSecondDialogOpen(false);
        setIsFirstDialogOpen(false);
        router.push("/posts");
      } else {
        setError(result.error || "Failed to publish post");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    if (mode === "resend") {
      setIsSecondDialogOpen(value);
    } else {
      setIsFirstDialogOpen(value);
    }
  }, [value, mode]);

  useEffect(() => {
    if (mode === "resend") {
      onOpenChange(isSecondDialogOpen);
    } else {
      onOpenChange(isFirstDialogOpen);
    }
  }, [isFirstDialogOpen, isSecondDialogOpen, onOpenChange, mode]);

  // Reset individual send state when dialog closes
  useEffect(() => {
    if (!value) {
      setSendMode("all");
      setSelectedEmails([]);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [value]);

  // Debounced subscriber search
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimerRef.current = setTimeout(() => {
      searchSubscribersForSend(searchQuery)
        .then((results) => {
          setSearchResults(results);
        })
        .catch(() => {
          setSearchResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery]);

  const getPublishSummary = (): string => {
    if (mode === "resend") {
      if (sendMode === "individual") {
        return `Re-sending newsletter to ${selectedEmails.length} selected recipient${selectedEmails.length !== 1 ? "s" : ""}.`;
      }
      return `Re-sending newsletter to ${totalMembers || "all"} subscribers.`;
    }

    const timeStr =
      scheduleType === "now"
        ? "immediately"
        : `on ${formatDayAndDate(inputDate)} at ${inputTimeIst} IST`;

    if (publishType === "newsletter") {
      if (sendMode === "individual") {
        return `Your post will be published ${timeStr} and sent to ${selectedEmails.length} selected recipient${selectedEmails.length !== 1 ? "s" : ""}.`;
      }
      return `Your post will be published ${timeStr} and sent to ${totalMembers || "all"} subscribers.`;
    }
    return `Your post will be published ${timeStr} on your blog.`;
  };

  const getPublishButtonText = (): string => {
    if (isPublishing) {
      return mode === "resend" ? "Resending..." : "Publishing...";
    }
    if (mode === "resend") {
      return "Resend Newsletter";
    }
    if (scheduleType === "now") {
      return publishType === "newsletter" ? "Publish & Send" : "Publish Now";
    }
    return `Schedule for ${formatDayAndDate(inputDate)}`;
  };

  const toggleEmailSelection = (email: string): void => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const removeEmail = (email: string): void => {
    setSelectedEmails((prev) => prev.filter((e) => e !== email));
  };

  return (
    <>
      {publishType === "newsletter" && Boolean(postContent) && (
        <NewsletterMarkdown />
      )}

      {/* FIRST DIALOG - Settings */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsFirstDialogOpen(false);
        }}
        open={isFirstDialogOpen}
      >
        <DialogContent className="fixed w-full h-full bg-neutral-900 border-none flex flex-col !max-w-none !max-h-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Button
              className="text-neutral-400 hover:text-white"
              onClick={handleCloseFirstDialog}
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to editor
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <DialogHeader className="mb-10 text-center">
                <DialogTitle>
                  <div className="text-4xl md:text-5xl font-bold text-green-500 mb-3">
                    Ready to publish?
                  </div>
                  <div className="text-2xl md:text-3xl font-medium text-neutral-300">
                    Configure your post settings
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                {/* Schedule Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-neutral-200">
                    When do you want to publish?
                  </Label>
                  <RadioGroup
                    className="space-y-3"
                    onValueChange={handleScheduleChange}
                    value={scheduleType}
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        scheduleType === "now"
                          ? "border-green-500 bg-green-500/10"
                          : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setScheduleType("now");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setScheduleType("now");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <RadioGroupItem
                        className="border-neutral-500 text-green-500"
                        id="schedule-now"
                        value="now"
                      />
                      <Zap
                        className={`size-5 ${scheduleType === "now" ? "text-green-500" : "text-neutral-400"}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Publish right now
                        </div>
                        <div className="text-sm text-neutral-400">
                          Your post goes live immediately
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        scheduleType === "later"
                          ? "border-green-500 bg-green-500/10"
                          : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setScheduleType("later");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setScheduleType("later");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <RadioGroupItem
                        className="border-neutral-500 text-green-500"
                        id="schedule-later"
                        value="later"
                      />
                      <Calendar
                        className={`size-5 ${scheduleType === "later" ? "text-green-500" : "text-neutral-400"}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Schedule for later
                        </div>
                        <div className="text-sm text-neutral-400">
                          Set a future date and time
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {scheduleType === "later" && (
                    <div className="flex gap-3 mt-4 p-4 bg-neutral-800/50 rounded-lg">
                      <DatePicker date={inputDate} setDate={setInputDate} />
                      <div className="flex items-center bg-neutral-700 rounded-md">
                        <input
                          className="h-10 w-24 rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm"
                          onChange={handleTimeChange}
                          type="time"
                          value={inputTimeIst}
                        />
                        <span className="text-neutral-400 mr-3 text-[10px]">
                          IST
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Publish Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-neutral-200">
                    How do you want to publish?
                  </Label>
                  <RadioGroup
                    className="space-y-3"
                    onValueChange={handlePublishTypeChange}
                    value={publishType}
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        publishType === "blog"
                          ? "border-green-500 bg-green-500/10"
                          : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setPublishType("blog");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setPublishType("blog");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <RadioGroupItem
                        className="border-neutral-500 text-green-500"
                        id="publish-blog"
                        value="blog"
                      />
                      <FileText
                        className={`size-5 ${publishType === "blog" ? "text-green-500" : "text-neutral-400"}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">Blog only</div>
                        <div className="text-sm text-neutral-400">
                          Publish to your blog section
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        publishType === "newsletter"
                          ? "border-green-500 bg-green-500/10"
                          : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setPublishType("newsletter");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setPublishType("newsletter");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <RadioGroupItem
                        className="border-neutral-500 text-green-500"
                        id="publish-newsletter"
                        value="newsletter"
                      />
                      <Mail
                        className={`size-5 ${publishType === "newsletter" ? "text-green-500" : "text-neutral-400"}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Send as newsletter
                        </div>
                        <div className="text-sm text-neutral-400">
                          Publish to blog and email to {totalMembers || "all"}{" "}
                          subscribers
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Send Mode Selection - only for newsletters */}
                {publishType === "newsletter" && (
                  <div className="space-y-4">
                    <Label className="text-lg font-medium text-neutral-200">
                      Who should receive this?
                    </Label>
                    <div className="flex gap-3">
                      <Button
                        className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                          sendMode === "all"
                            ? "border-green-500 bg-green-500/10 text-white"
                            : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600"
                        }`}
                        onClick={() => {
                          setSendMode("all");
                        }}
                        variant="ghost"
                      >
                        <Users className="size-4 mr-2" />
                        All Subscribers ({totalMembers || 0})
                      </Button>
                      <Button
                        className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                          sendMode === "individual"
                            ? "border-green-500 bg-green-500/10 text-white"
                            : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600"
                        }`}
                        onClick={() => {
                          setSendMode("individual");
                        }}
                        variant="ghost"
                      >
                        <User className="size-4 mr-2" />
                        Individual Emails
                      </Button>
                    </div>

                    {/* Individual Email Search & Selection */}
                    {sendMode === "individual" && (
                      <div className="space-y-3 p-4 bg-neutral-800/50 rounded-lg">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                          <Input
                            className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500"
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                            }}
                            placeholder="Search subscribers by name or email..."
                            value={searchQuery}
                          />
                          {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 animate-spin" />
                          )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="max-h-48 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800">
                            {searchResults.map((result) => (
                              <button
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-left ${
                                  selectedEmails.includes(result.email)
                                    ? "bg-green-500/10"
                                    : ""
                                }`}
                                key={result.email}
                                onClick={() => {
                                  toggleEmailSelection(result.email);
                                }}
                                type="button"
                              >
                                <div
                                  className={`size-4 rounded border flex items-center justify-center ${
                                    selectedEmails.includes(result.email)
                                      ? "bg-green-500 border-green-500"
                                      : "border-neutral-500"
                                  }`}
                                >
                                  {selectedEmails.includes(result.email) && (
                                    <Check className="size-3 text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-neutral-400 text-xs truncate">
                                    {result.email}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Selected emails badges */}
                        {selectedEmails.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedEmails.map((email) => (
                              <Badge
                                className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                                key={email}
                                variant="outline"
                              >
                                {email}
                                <button
                                  className="ml-1 hover:text-white"
                                  onClick={() => {
                                    removeEmail(email);
                                  }}
                                  type="button"
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {selectedEmails.length === 0 && (
                          <p className="text-sm text-neutral-500">
                            Search and select at least one recipient.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  disabled={
                    publishType === "newsletter" &&
                    sendMode === "individual" &&
                    selectedEmails.length === 0
                  }
                  onClick={handleContinueToPreview}
                >
                  <Eye className="mr-2 size-5" />
                  Preview post
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PREVIEW DIALOG */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsPreviewDialogOpen(false);
        }}
        open={isPreviewDialogOpen}
      >
        <DialogContent className="fixed w-full h-full bg-neutral-900 border-none flex flex-col !max-w-none !max-h-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Button
              className="text-neutral-400 hover:text-white"
              onClick={handleBackToSettingsFromPreview}
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to settings
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Preview</span>
              <Eye className="size-4 text-neutral-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-8 py-10">
              {/* Feature Image */}
              {Boolean(postFeatureImage) && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <Image
                    alt={postTitle}
                    className="w-full h-64 md:h-96 object-cover"
                    height={600}
                    src={postFeatureImage}
                    width={1200}
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {postTitle}
              </h1>

              {/* Meta info */}
              <div className="flex items-center gap-4 mb-8 text-neutral-400 text-sm">
                <span>
                  {scheduleType === "now"
                    ? "Publishing now"
                    : `Scheduled for ${formatDayAndDate(inputDate)}`}
                </span>
                <span>•</span>
                <span>
                  {publishType === "newsletter"
                    ? "Blog + Newsletter"
                    : "Blog only"}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-700 mb-8" />

              {/* Content Preview */}
              <div className="prose prose-invert prose-lg max-w-none">
                <BlockNoteRenderer
                  className="text-neutral-200"
                  content={postContent}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-800 px-6 py-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                onClick={() => {
                  void handleContinueToConfirm();
                }}
              >
                Looks good, continue
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                className="flex-1 py-6 text-lg bg-neutral-700 hover:bg-neutral-600 text-white"
                onClick={handleBackToSettingsFromPreview}
                variant="ghost"
              >
                Back to settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SECOND DIALOG - Confirmation */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsSecondDialogOpen(false);
        }}
        open={isSecondDialogOpen}
      >
        <DialogContent className="fixed w-full h-full border-none bg-neutral-900 flex flex-col !max-w-none !max-h-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Button
              className="text-neutral-400 hover:text-white"
              onClick={
                mode === "resend"
                  ? () => {
                      setIsSecondDialogOpen(false);
                      onOpenChange(false);
                    }
                  : handleBackToSettings
              }
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {mode === "resend" ? "Cancel" : "Back to preview"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-lg text-center">
              <DialogHeader className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    {mode === "resend" ? (
                      <Mail className="size-10 text-green-500" />
                    ) : (
                      <Check className="size-10 text-green-500" />
                    )}
                  </div>
                </div>
                <DialogTitle>
                  <div className="text-4xl md:text-5xl font-bold text-green-500 mb-3">
                    {mode === "resend" ? "Resend Newsletter" : "Almost there!"}
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-neutral-300">
                    {mode === "resend"
                      ? "Choose who receives this newsletter"
                      : "Review your publish settings"}
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Resend mode: show recipient selection in confirmation dialog */}
              {mode === "resend" && (
                <div className="bg-neutral-800/50 rounded-xl p-6 mb-6 text-left">
                  <Label className="text-base font-medium text-neutral-200 mb-3 block">
                    Send to:
                  </Label>
                  <div className="flex gap-3 mb-4">
                    <Button
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        sendMode === "all"
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setSendMode("all");
                      }}
                      variant="ghost"
                    >
                      <Users className="size-4 mr-2" />
                      All ({totalMembers || 0})
                    </Button>
                    <Button
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        sendMode === "individual"
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600"
                      }`}
                      onClick={() => {
                        setSendMode("individual");
                      }}
                      variant="ghost"
                    >
                      <User className="size-4 mr-2" />
                      Individual
                    </Button>
                  </div>

                  {sendMode === "individual" && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                        <Input
                          className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500"
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                          }}
                          placeholder="Search subscribers..."
                          value={searchQuery}
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 animate-spin" />
                        )}
                      </div>

                      {searchResults.length > 0 && (
                        <div className="max-h-36 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800">
                          {searchResults.map((result) => (
                            <button
                              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-left ${
                                selectedEmails.includes(result.email)
                                  ? "bg-green-500/10"
                                  : ""
                              }`}
                              key={result.email}
                              onClick={() => {
                                toggleEmailSelection(result.email);
                              }}
                              type="button"
                            >
                              <div
                                className={`size-4 rounded border flex items-center justify-center ${
                                  selectedEmails.includes(result.email)
                                    ? "bg-green-500 border-green-500"
                                    : "border-neutral-500"
                                }`}
                              >
                                {selectedEmails.includes(result.email) && (
                                  <Check className="size-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm">
                                  {result.name}
                                </span>
                                <span className="text-neutral-400 text-xs ml-2">
                                  {result.email}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedEmails.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedEmails.map((email) => (
                            <Badge
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                              key={email}
                              variant="outline"
                            >
                              {email}
                              <button
                                className="ml-1 hover:text-white"
                                onClick={() => {
                                  removeEmail(email);
                                }}
                                type="button"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Publish mode summary */}
              {mode !== "resend" && (
                <div className="bg-neutral-800/50 rounded-xl p-6 mb-8 text-left">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Publish Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-neutral-300">
                      {scheduleType === "now" ? (
                        <Zap className="size-5 text-green-500" />
                      ) : (
                        <Calendar className="size-5 text-green-500" />
                      )}
                      <span>
                        {scheduleType === "now"
                          ? "Publishing immediately"
                          : `Scheduled for ${formatDayAndDate(inputDate)} at ${inputTimeIst} IST`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                      {publishType === "newsletter" ? (
                        <Mail className="size-5 text-green-500" />
                      ) : (
                        <FileText className="size-5 text-green-500" />
                      )}
                      <span>
                        {(() => {
                          if (publishType !== "newsletter") return "Blog only";
                          if (sendMode === "individual") {
                            return `Newsletter to ${selectedEmails.length} recipient${selectedEmails.length !== 1 ? "s" : ""}`;
                          }
                          return `Blog + Newsletter to ${totalMembers || "all"} subscribers`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-neutral-400 mb-8">{getPublishSummary()}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  disabled={
                    isPublishing ||
                    (sendMode === "individual" && selectedEmails.length === 0)
                  }
                  onClick={() => {
                    void handlePublish();
                  }}
                >
                  {getPublishButtonText()}
                </Button>
                <Button
                  className="flex-1 py-6 text-lg bg-neutral-700 hover:bg-neutral-600 text-white"
                  disabled={isPublishing}
                  onClick={
                    mode === "resend"
                      ? () => {
                          setIsSecondDialogOpen(false);
                          onOpenChange(false);
                        }
                      : handleBackToSettings
                  }
                  variant="ghost"
                >
                  {mode === "resend" ? "Cancel" : "Back to preview"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatDayAndDate(date: Date): string {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  } as const;
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

export default PublishDialog;
