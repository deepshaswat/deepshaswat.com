"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@repo/ui/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";

export const Youtube = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      url: {
        default: "" as const,
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      let url = "";
      return (
        <div
          className={cn(
            !props.block.props.url
              ? "rounded-md w-full justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              : "relative w-full aspect-video",
          )}
        >
          {props.block.props.url ? (
            <iframe
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              src={props.block.props.url}
              title="YouTube video player"
            />
          ) : (
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <Button
                  className="w-full justify-start gap-x-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300"
                  size="lg"
                  variant="secondary"
                >
                  <FaYoutube />
                  Add Video
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-300">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Place YouTube video URL here:
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-300 placeholder-neutral-500 focus:border-green-500 focus:ring-0"
                      onChange={(e) => {
                        url = e.currentTarget.value;
                      }}
                      placeholder="URL"
                      type="text"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-neutral-900 dark:text-neutral-950 hover:bg-neutral-200 dark:hover:bg-neutral-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800 bg-neutral-100 dark:bg-neutral-950"
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "youtube",
                        props: {
                          url: url.replace("/watch?v=", "/embed/"),
                        },
                      })
                    }
                  >
                    Embed
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      );
    },
  },
);
