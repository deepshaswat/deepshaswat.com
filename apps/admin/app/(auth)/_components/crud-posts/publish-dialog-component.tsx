"use client";

import { dateTimeValidation, publishPost } from "@repo/actions";
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

interface PublishDialogProps {
  value: boolean;
  onOpenChange: (value: boolean) => void;
}

function PublishDialog({
  value,
  onOpenChange,
}: PublishDialogProps): JSX.Element {
  const router = useRouter();

  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(value);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [finalTime, setFinalTime] = useState<Date | null>(null);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [publishType, setPublishType] = useState<"blog" | "newsletter">("blog");
  const [isPublishing, setIsPublishing] = useState(false);
  const [_error, setError] = useRecoilState(savePostErrorState);

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

      const result = await publishPost(
        postId,
        publishTime,
        scheduleType,
        publishType,
        post,
        markdown,
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
    setIsFirstDialogOpen(value);
  }, [value]);

  useEffect(() => {
    onOpenChange(isFirstDialogOpen);
  }, [isFirstDialogOpen, onOpenChange]);

  const getPublishSummary = (): string => {
    const timeStr =
      scheduleType === "now"
        ? "immediately"
        : `on ${formatDayAndDate(inputDate)} at ${inputTimeIst} IST`;

    if (publishType === "newsletter") {
      return `Your post will be published ${timeStr} and sent to ${totalMembers || "all"} subscribers.`;
    }
    return `Your post will be published ${timeStr} on your blog.`;
  };

  const getPublishButtonText = (): string => {
    if (isPublishing) return "Publishing...";
    if (scheduleType === "now") {
      return publishType === "newsletter" ? "Publish & Send" : "Publish Now";
    }
    return `Schedule for ${formatDayAndDate(inputDate)}`;
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

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
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
              onClick={handleBackToSettings}
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to preview
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-lg text-center">
              <DialogHeader className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="size-10 text-green-500" />
                  </div>
                </div>
                <DialogTitle>
                  <div className="text-4xl md:text-5xl font-bold text-green-500 mb-3">
                    Almost there!
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-neutral-300">
                    Review your publish settings
                  </div>
                </DialogTitle>
              </DialogHeader>

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
                      {publishType === "newsletter"
                        ? `Blog + Newsletter to ${totalMembers || "all"} subscribers`
                        : "Blog only"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-neutral-400 mb-8">{getPublishSummary()}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  disabled={isPublishing}
                  onClick={() => {
                    void handlePublish();
                  }}
                >
                  {getPublishButtonText()}
                </Button>
                <Button
                  className="flex-1 py-6 text-lg bg-neutral-700 hover:bg-neutral-600 text-white"
                  disabled={isPublishing}
                  onClick={handleBackToSettings}
                  variant="ghost"
                >
                  Back to preview
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
