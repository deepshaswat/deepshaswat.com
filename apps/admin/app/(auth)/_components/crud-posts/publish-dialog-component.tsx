"use client";

import { dateTimeValidation, publishPost } from "@repo/actions";
import {
  selectDate,
  postDataState,
  selectedTimeIst,
  postIdState,
  savePostErrorState,
} from "@repo/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  useNewsletterMarkdown,
} from "@repo/ui";
import { ChevronLeft, MoveRight } from "lucide-react";
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
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [finalTime, setFinalTime] = useState<Date | null>(null);
  const [scheduleType, setScheduleType] = useState("now");
  const [publishType, setPublishType] = useState("blog");
  const [openAccordionItem, setOpenAccordionItem] = useState<
    string | undefined
  >(undefined);
  const [_error, setError] = useRecoilState(savePostErrorState);

  const [inputDate, _setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, _setInputTimeIst] = useRecoilState(selectedTimeIst);

  const postId = useRecoilValue(postIdState);
  const post = useRecoilValue(postDataState);

  const { markdown: newsletterMarkdown, NewsletterMarkdown } =
    useNewsletterMarkdown(post?.content || "");

  const handleScheduleTypeChange = (type: string): void => {
    setScheduleType(type);
    if (type === "later") {
      setOpenAccordionItem("schedule");
    }
  };

  const handleContinue = (): void => {
    setIsFirstDialogOpen(false);
    setIsSecondDialogOpen(true);
  };

  const handleBackToSettings = (): void => {
    setIsSecondDialogOpen(false);
    setIsFirstDialogOpen(true);
  };

  const handlePublish = async (): Promise<void> => {
    if (!postId) {
      // eslint-disable-next-line no-console -- Error logging for missing post ID
      console.error("Post ID is required");
      return;
    }
    try {
      const markdown = publishType === "newsletter" ? newsletterMarkdown : "";

      const timeValidation = await dateTimeValidation(inputDate, inputTimeIst);

      if (timeValidation.error) {
        setError(timeValidation.error);
      } else if (timeValidation.combinedDate) {
        setError(null);
        const combinedDate = timeValidation.combinedDate;
        setFinalTime(combinedDate);
      }

      if (!finalTime) {
        // eslint-disable-next-line no-console -- Error logging for missing publish time
        console.error("Publish time is required");
        return;
      }

      if (!post) {
        // eslint-disable-next-line no-console -- Error logging for missing post data
        console.error("Post data is required");
        return;
      }

      const result = await publishPost(
        postId,
        finalTime,
        scheduleType,
        publishType,
        post,
        markdown,
      );

      if (result.success) {
        // eslint-disable-next-line no-console -- Success logging for publish operation
        console.log("Post published successfully");
        setIsSecondDialogOpen(false);
        setIsFirstDialogOpen(false);
        router.push("/posts");
      } else {
        // eslint-disable-next-line no-console -- Error logging for publish failure
        console.error("Error publishing post:", result.error);
        setError(result.error || "Failed to publish post");
      }
    } catch (caughtError) {
      // eslint-disable-next-line no-console -- Error logging for unexpected errors
      console.error("Error publishing post:", caughtError);
      setError("An unexpected error occurred");
    }
  };

  useEffect(() => {
    setIsFirstDialogOpen(value);
  }, [value]);

  useEffect(() => {
    onOpenChange(isFirstDialogOpen);
  }, [isFirstDialogOpen, onOpenChange]);

  const getScheduleText = (
    scheduleTypeParam: string,
    publishTypeParam: string,
    dateParam: Date,
    timeIstParam: string,
  ): string => {
    if (scheduleTypeParam === "now") {
      return publishTypeParam === "newsletter"
        ? "Publish & send, right now"
        : "Publish, right now";
    }

    return `Schedule for ${formatDayAndDate(dateParam)} at ${timeIstParam} IST`;
  };

  return (
    <>
      {/* Hidden component to generate markdown */}
      {publishType === "newsletter" && Boolean(post?.content) && (
        <NewsletterMarkdown />
      )}

      {/* FIRST DIALOG */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsFirstDialogOpen(false);
        }}
        open={isFirstDialogOpen}
      >
        <DialogContent className="fixed  w-full h-full bg-gray-900 border-none flex flex-col !max-w-none !max-h-none overflow-hidden">
          {/* Top Navigation Area */}
          <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button
                className="text-muted-foreground"
                onClick={() => {
                  setIsFirstDialogOpen(false);
                }}
                variant="ghost"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Editor</span>
              </Button>
            </div>
            <div className="flex items-center space-x-4 mr-4">
              <Button className="text-gray-400" variant="ghost">
                Preview
              </Button>
              <Button
                className="text-green-500 hover:text-green-500 bg-neutral-800 hover:bg-neutral-950"
                onClick={() => {
                  setIsFirstDialogOpen(false);
                }}
                variant="ghost"
              >
                Publish
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          {/*
            1) Use flex-1 to stretch
            2) items-center + justify-center to center content
            (If you'd rather keep it top-aligned but centered horizontally, remove justify-center.)
          */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 ">
            {/* You can also wrap this in a narrower container if desired */}
            <div className="w-full max-w-xl">
              <DialogHeader className="mb-10 text-left sm:text-center">
                <DialogTitle className="-mt-12">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-500 mb-2">
                    Ready, set, publish.
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    Share it with the world.
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-12">
                <Accordion
                  className="w-full space-y-3"
                  collapsible
                  onValueChange={setOpenAccordionItem}
                  type="single"
                  value={openAccordionItem}
                >
                  <AccordionItem
                    className="border-b-[1px] border-gray-700"
                    value="publish-type"
                  >
                    <AccordionTrigger className="text-gray-200 text-lg">
                      {publishType === "newsletter"
                        ? "Publish and email"
                        : "Publish only"}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex gap-2 mb-4">
                        <Badge
                          className={`cursor-pointer text-base py-2 px-4 rounded-md ${
                            publishType === "blog"
                              ? "bg-green-500"
                              : "bg-gray-700"
                          }`}
                          onClick={() => {
                            setPublishType("blog");
                          }}
                        >
                          Blog
                        </Badge>
                        <Badge
                          className={`cursor-pointer text-base py-2 px-4 rounded-md ${
                            publishType === "newsletter"
                              ? "bg-green-500"
                              : "bg-gray-700"
                          }`}
                          onClick={() => {
                            setPublishType("newsletter");
                          }}
                        >
                          Newsletter
                        </Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    className="border-b-[1px] border-gray-700"
                    value="subscribers"
                  >
                    <AccordionTrigger className="text-gray-200 text-lg">
                      All 405 subscribers
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-400">
                        Functionality to be added later
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border-none" value="schedule">
                    <AccordionTrigger className="text-gray-200 text-lg">
                      {scheduleType === "now"
                        ? "Right now"
                        : `Schedule for ${formatDayAndDate(
                            inputDate,
                          )} at ${inputTimeIst} IST`}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Badge
                            className={`cursor-pointer text-base py-2 px-4 rounded-md ${
                              scheduleType === "now"
                                ? "bg-green-500"
                                : "bg-gray-700"
                            }`}
                            onClick={() => {
                              handleScheduleTypeChange("now");
                            }}
                          >
                            Set it live now
                          </Badge>
                          <Badge
                            className={`cursor-pointer text-base py-2 px-4 rounded-md ${
                              scheduleType === "later"
                                ? "bg-green-500"
                                : "bg-gray-700"
                            }`}
                            onClick={() => {
                              handleScheduleTypeChange("later");
                            }}
                          >
                            Schedule for later
                          </Badge>
                        </div>

                        {/* {scheduleType === "later" && (
                          <div className='flex flex-col items-center sm:flex-row gap-4'>
                            <div className='bg-gray-900 p-2 rounded'>
                              <DatePicker
                                date={inputDate}
                                setDate={setInputDate}
                              />
                            </div>

                            <div className='flex flex-row items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md'>
                              <input
                                type='time'
                                value={inputTimeIst}
                                onChange={(e) =>
                                  setInputTimeIst(e.target.value)
                                }
                                className=' p-2  h-10 rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 group-hover:bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                              />
                              <span className='text-neutral-400 items-center mr-4 text-[10px]'>
                                IST
                              </span>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button
                  className="bg-white text-black hover:bg-gray-200 py-6 text-lg mt-8"
                  onClick={handleContinue}
                >
                  <span className="flex flex-row items-center ml-2">
                    Continue, final review
                    <MoveRight className="size-5 ml-4 mr-2" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SECOND DIALOG */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsSecondDialogOpen(false);
        }}
        open={isSecondDialogOpen}
      >
        <DialogContent className="fixed w-full h-full border-none bg-gray-900 flex flex-col !max-w-none !max-h-none overflow-hidden">
          {/* Top Navigation Area */}
          <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 ">
            <div className="flex items-center space-x-2">
              <Button
                className="text-muted-foreground"
                onClick={() => {
                  setIsSecondDialogOpen(false);
                }}
                variant="ghost"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Editor</span>
              </Button>
            </div>
            <div className="flex flex-row items-center space-x-4 mr-4">
              <Button className="text-gray-400" variant="ghost">
                Preview
              </Button>
              <Button
                className="text-green-500 hover:text-green-500 bg-neutral-800 hover:bg-neutral-950"
                onClick={() => {
                  setIsSecondDialogOpen(false);
                }}
                variant="ghost"
              >
                Publish
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-xl">
              <DialogHeader className="mb-8 text-left sm:text-center">
                <DialogTitle className="-mt-12">
                  <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-500 mb-3">
                    Ready, set, publish.
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    Share it with the world.
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <p className="text-gray-300 text-base sm:text-lg">
                  Your post will be published on your{" "}
                  {publishType === "newsletter"
                    ? "newsletter section, and delivered to all 405 subscribers."
                    : "blog section."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600  py-6 "
                    onClick={() => {
                      void handlePublish();
                    }}
                  >
                    {getScheduleText(
                      scheduleType,
                      publishType,
                      inputDate,
                      inputTimeIst,
                    )}
                  </Button>
                  <Button
                    className="flex-1 py-6 bg-neutral-700 "
                    onClick={handleBackToSettings}
                    variant="ghost"
                  >
                    Back to settings
                  </Button>
                </div>
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
