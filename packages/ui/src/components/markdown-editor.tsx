"use client";

import React, { useState, useRef, useEffect } from "react";
import { createReactBlockSpec } from "@blocknote/react";
import { Button, Textarea } from "@repo/ui";
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaQuoteRight,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
} from "react-icons/fa";
import { cn } from "@repo/ui/utils";
import ReactMarkdown from "react-markdown";

export const Markdown = createReactBlockSpec(
  {
    type: "markdown",
    propSchema: {
      content: {
        default: "" as const,
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const [markdownContent, setMarkdownContent] = useState(
        props.block.props.content,
      );
      const [isEditing, setIsEditing] = useState(!props.block.props.content);
      const editorRef = useRef<HTMLDivElement>(null);
      const textareaRef = useRef<HTMLTextAreaElement>(null);
      const [activeListSymbol, setActiveListSymbol] = useState<string | null>(
        null,
      );
      const [currentHeader, setCurrentHeader] = useState<string>("");

      useEffect(() => {
        if (isEditing && textareaRef.current) {
          textareaRef.current.focus();
        }
      }, [isEditing]);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            editorRef.current &&
            !editorRef.current.contains(event.target as Node)
          ) {
            handleSave();
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [markdownContent]);

      const handleSave = () => {
        if (isEditing) {
          props.editor.updateBlock(props.block, {
            type: "markdown",
            props: {
              content: markdownContent,
            },
          });
          setIsEditing(false);
        }
      };

      const insertMarkdownSymbol = (symbol: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const after = text.substring(end);

        const selectedText = text.substring(start, end);
        let newText = "";

        // Handle bold and italic
        if (symbol === "*" || symbol === "**") {
          newText = before + symbol + selectedText + symbol + after;
          setMarkdownContent(newText);
          textarea.setSelectionRange(
            start + symbol.length,
            end + symbol.length,
          );
        }
        // Handle links
        else if (symbol === "[]()") {
          if (selectedText) {
            newText = before + "[" + selectedText + "]()" + after;
            setMarkdownContent(newText);
            textarea.setSelectionRange(
              start + selectedText.length + 3,
              start + selectedText.length + 3,
            );
          } else {
            newText = before + "[]()" + after;
            setMarkdownContent(newText);
            textarea.setSelectionRange(start + 1, start + 1);
          }
        }
        // Handle headers
        else if (symbol === "# ") {
          const lineStartIndex = before.lastIndexOf("\n") + 1;
          const currentLine = before.substring(lineStartIndex, start);

          if (currentLine.startsWith("# ")) {
            // Toggle between H1, H2, and H3
            if (currentHeader === "H1") {
              newText =
                before.substring(0, lineStartIndex) +
                "## " +
                currentLine.substring(2) +
                selectedText +
                after;
              setCurrentHeader("H2");
            } else if (currentHeader === "H2") {
              newText =
                before.substring(0, lineStartIndex) +
                "### " +
                currentLine.substring(3) +
                selectedText +
                after;
              setCurrentHeader("H3");
            } else if (currentHeader === "H3") {
              newText =
                before.substring(0, lineStartIndex) +
                currentLine.substring(4) +
                selectedText +
                after;
              setCurrentHeader(""); // Clear the header
            }
          } else {
            newText =
              before.substring(0, lineStartIndex) +
              symbol +
              currentLine +
              selectedText +
              after;
            setCurrentHeader("H1");
          }
          setMarkdownContent(newText);
          textarea.setSelectionRange(
            lineStartIndex + symbol.length,
            lineStartIndex + symbol.length,
          );
        }
        // Handle lists and blockquote
        else {
          const lineStartIndex = before.lastIndexOf("\n") + 1;
          const currentLine = before.substring(lineStartIndex, start);

          // Toggle the active list symbol
          if (symbol === "- " || symbol === "1. ") {
            if (activeListSymbol === symbol) {
              // Remove the list symbol if already active
              newText =
                before.substring(0, lineStartIndex) +
                currentLine.substring(symbol.length) +
                selectedText +
                after;
              setActiveListSymbol(null);
            } else {
              newText =
                before.substring(0, lineStartIndex) +
                symbol +
                currentLine +
                selectedText +
                after;
              setActiveListSymbol(symbol);
            }
          } else {
            newText =
              before.substring(0, lineStartIndex) +
              symbol +
              currentLine +
              selectedText +
              after;
          }
          setMarkdownContent(newText);
          textarea.setSelectionRange(
            lineStartIndex + symbol.length,
            lineStartIndex + symbol.length,
          );
        }

        textarea.focus();
      };

      // Handle pressing Enter key to continue the list
      const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && activeListSymbol) {
          e.preventDefault(); // Prevent default newline insertion
          const textarea = textareaRef.current;
          if (!textarea) return;

          const start = textarea.selectionStart;
          const before = textarea.value.substring(0, start);
          const after = textarea.value.substring(start);

          const newText = before + `\n${activeListSymbol}` + after;
          setMarkdownContent(newText);

          // Move the cursor after the inserted list symbol
          textarea.setSelectionRange(
            start + activeListSymbol.length + 1,
            start + activeListSymbol.length + 1,
          );
        }
      };

      return (
        <div
          ref={editorRef}
          className={cn(
            "w-full bg-transparent",
            isEditing
              ? "border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 rounded-md !m-0 !p-0"
              : "",
          )}
        >
          {isEditing ? (
            <div className="border-2 border-green-500 rounded-md p-0 m-0">
              <Textarea
                ref={textareaRef}
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-neutral-900 text-neutral-300 border-0 focus:ring-0 focus:outline-none focus:border-transparent focus-within:outline-none focus-within:ring-0 focus-within:border-transparent p-4 rounded-t-md whitespace-pre-wrap" // preserve newlines
                rows={10}
                placeholder="Enter your markdown..."
              />
              <div className="flex items-center justify-between bg-neutral-800 p-2">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => insertMarkdownSymbol("**")}
                    className="text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                    variant="ghost"
                    size="icon"
                  >
                    <FaBold />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("*")}
                    className="text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                    variant="ghost"
                    size="icon"
                  >
                    <FaItalic />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("# ")}
                    className={`text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                      currentHeader ? "bg-neutral-700" : ""
                    }`}
                    variant="ghost"
                    size="icon"
                  >
                    <FaHeading />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("> ")}
                    className={`text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none`}
                    variant="ghost"
                    size="icon"
                  >
                    <FaQuoteRight />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("- ")}
                    className={`text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                      activeListSymbol === "- " ? "bg-neutral-700" : ""
                    }`}
                    variant="ghost"
                    size="icon"
                  >
                    <FaListUl />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("1. ")}
                    className={`text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                      activeListSymbol === "1. " ? "bg-neutral-700" : ""
                    }`}
                    variant="ghost"
                    size="icon"
                  >
                    <FaListOl />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("[]()")}
                    className="text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                    variant="ghost"
                    size="icon"
                  >
                    <FaLink />
                  </Button>
                  <Button
                    onClick={() => insertMarkdownSymbol("![]()")}
                    className="text-neutral-300 hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                    variant="ghost"
                    size="icon"
                  >
                    <FaImage />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="markdown-content text-neutral-300 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mb-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-2" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-[2px] border-green-700 pl-4 p-1 italic text-neutral-200 mb-2"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-500 hover:underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto mb-2" {...props} />
                  ),
                }}
              >
                {props.block.props.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      );
    },
  },
);
