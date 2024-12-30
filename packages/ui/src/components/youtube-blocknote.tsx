"use client";

import { createReactBlockSpec } from "@blocknote/react";
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
  Button,
  Input,
} from "@repo/ui";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@repo/ui/utils";

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
              ? "rounded-md w-full justify-center bg-neutral-800 text-neutral-300"
              : "relative w-full aspect-video"
          )}
        >
          {props.block.props.url ? (
            <iframe
              src={props.block.props.url}
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
              allowFullScreen
            />
          ) : (
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-start gap-x-2 bg-neutral-700 hover:bg-neutral-950 text-neutral-300"
                >
                  <FaYoutube />
                  Add Video
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-neutral-900 text-neutral-300">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Place YouTube video URL here:
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      type="text"
                      placeholder="URL"
                      className="bg-neutral-800 border-neutral-700 text-neutral-300 placeholder-neutral-500 focus:border-green-500 focus:ring-0"
                      onChange={(e) => {
                        url = e.currentTarget.value;
                      }}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-neutral-950 hover:bg-neutral-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      props.editor.updateBlock(props.block, {
                        type: "youtube",
                        props: {
                          url: url.replace("/watch?v=", "/embed/"),
                        },
                      })
                    }
                    className="hover:bg-neutral-800 bg-neutral-950"
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
  }
);
