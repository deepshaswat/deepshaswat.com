"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createReactBlockSpec } from "@blocknote/react";
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
import ReactMarkdown from "react-markdown";
import { cn } from "@repo/ui/utils";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

function createMarkdownComponents(
  canEdit: boolean,
): Record<string, React.ComponentType<Record<string, unknown>>> {
  return {
    h1: ({ _node, ...props }: Record<string, unknown>) => (
      <h1
        className={cn("text-2xl font-bold mb-2", !canEdit && "select-none")}
        {...props}
      >
        {props.children as React.ReactNode}
      </h1>
    ),
    h2: ({ _node, ...props }: Record<string, unknown>) => (
      <h2
        className={cn("text-xl font-bold mb-2", !canEdit && "select-none")}
        {...props}
      >
        {props.children as React.ReactNode}
      </h2>
    ),
    h3: ({ _node, ...props }: Record<string, unknown>) => (
      <h3
        className={cn("text-lg font-bold mb-2", !canEdit && "select-none")}
        {...props}
      >
        {props.children as React.ReactNode}
      </h3>
    ),
    p: ({ _node, ...props }: Record<string, unknown>) => (
      <p className={cn("mb-2", !canEdit && "select-none")} {...props} />
    ),
    ul: ({ _node, ...props }: Record<string, unknown>) => (
      <ul
        className={cn(
          "list-disc ml-6 mb-2",
          !canEdit && "border-none select-none",
        )}
        {...props}
      />
    ),
    ol: ({ _node, ...props }: Record<string, unknown>) => (
      <ol
        className={cn(
          "list-decimal ml-6 mb-2",
          !canEdit && "border-none select-none",
        )}
        {...props}
      />
    ),
    li: ({ _node, ...props }: Record<string, unknown>) => (
      <li
        className={cn("mb-1", !canEdit && "border-none select-none")}
        {...props}
      />
    ),
    blockquote: ({ _node, ...props }: Record<string, unknown>) => (
      <blockquote
        className={cn(
          "border-l-[2px] border-green-700 pl-4 p-1 italic text-neutral-800 dark:text-neutral-200 mb-2",
          !canEdit && "border-none select-none",
        )}
        {...props}
      />
    ),
    a: ({ _node, ...props }: Record<string, unknown>) => (
      <a
        className={cn(
          "text-blue-500 hover:underline",
          !canEdit && "select-none",
        )}
        {...props}
      >
        {props.children as React.ReactNode}
      </a>
    ),
    img: ({ _node, ...props }: Record<string, unknown>) => (
      <img
        alt={(props.alt as string) || ""}
        className={cn("max-w-full h-auto mb-2", !canEdit && "select-none")}
        {...props}
      />
    ),
  };
}

interface MarkdownBlockProps {
  block: {
    props: {
      content: string;
    };
  };
  editor: {
    isEditable: boolean;
    updateBlock: (block: unknown, update: unknown) => void;
  };
}

function MarkdownRenderer({ block, editor }: MarkdownBlockProps): JSX.Element {
  const [markdownContent, setMarkdownContent] = useState(block.props.content);
  const [isEditing, setIsEditing] = useState(!block.props.content);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeListSymbol, setActiveListSymbol] = useState<string | null>(null);
  const [currentHeader, setCurrentHeader] = useState<string>("");

  // Only allow editing if the editor is editable
  const canEdit = editor.isEditable;

  useEffect(() => {
    if (isEditing && textareaRef.current && canEdit) {
      textareaRef.current.focus();
    }
  }, [isEditing, canEdit]);

  const handleSave = useCallback((): void => {
    if (isEditing && canEdit) {
      editor.updateBlock(block, {
        type: "markdown",
        props: {
          content: markdownContent,
        },
      });
      setIsEditing(false);
    }
  }, [isEditing, canEdit, editor, block, markdownContent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
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
  }, [handleSave]);

  const insertMarkdownSymbol = (symbol: string): void => {
    const textarea = textareaRef.current;
    if (!textarea || !canEdit) return;

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
      textarea.setSelectionRange(start + symbol.length, end + symbol.length);
    }
    // Handle links
    else if (symbol === "[]()") {
      if (selectedText) {
        newText = `${before}[${selectedText}]()${after}`;
        setMarkdownContent(newText);
        textarea.setSelectionRange(
          start + selectedText.length + 3,
          start + selectedText.length + 3,
        );
      } else {
        newText = `${before}[]()${after}`;
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
          newText = `${before.substring(0, lineStartIndex)}## ${currentLine.substring(2)}${selectedText}${after}`;
          setCurrentHeader("H2");
        } else if (currentHeader === "H2") {
          newText = `${before.substring(0, lineStartIndex)}### ${currentLine.substring(3)}${selectedText}${after}`;
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && activeListSymbol && canEdit) {
      e.preventDefault(); // Prevent default newline insertion
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const before = textarea.value.substring(0, start);
      const after = textarea.value.substring(start);

      const newText = `${before}\n${activeListSymbol}${after}`;
      setMarkdownContent(newText);

      // Move the cursor after the inserted list symbol
      textarea.setSelectionRange(
        start + activeListSymbol.length + 1,
        start + activeListSymbol.length + 1,
      );
    }
  };

  const markdownComponents = useMemo(
    () => createMarkdownComponents(canEdit),
    [canEdit],
  );

  return (
    <div
      className={cn(
        "w-full bg-transparent",
        isEditing && canEdit
          ? "border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 rounded-md !m-0 !p-0"
          : "",
      )}
      ref={editorRef}
    >
      {isEditing && canEdit ? (
        <div className="border-2 border-green-500 rounded-md p-0 m-0">
          <Textarea
            className="w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-300 border-0 focus:ring-0 focus:outline-none focus:border-transparent focus-within:outline-none focus-within:ring-0 focus-within:border-transparent p-4 rounded-t-md whitespace-pre-wrap"
            onChange={(e) => {
              setMarkdownContent(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your markdown..."
            ref={textareaRef}
            rows={10}
            value={markdownContent}
          />
          <div className="flex items-center justify-between bg-neutral-200 dark:bg-neutral-800 p-2">
            <div className="flex space-x-2">
              <Button
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                onClick={() => {
                  insertMarkdownSymbol("**");
                }}
                size="icon"
                variant="ghost"
              >
                <FaBold />
              </Button>
              <Button
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                onClick={() => {
                  insertMarkdownSymbol("*");
                }}
                size="icon"
                variant="ghost"
              >
                <FaItalic />
              </Button>
              <Button
                className={`text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                  currentHeader ? "bg-neutral-300 dark:bg-neutral-700" : ""
                }`}
                onClick={() => {
                  insertMarkdownSymbol("# ");
                }}
                size="icon"
                variant="ghost"
              >
                <FaHeading />
              </Button>
              <Button
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                onClick={() => {
                  insertMarkdownSymbol("> ");
                }}
                size="icon"
                variant="ghost"
              >
                <FaQuoteRight />
              </Button>
              <Button
                className={`text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                  activeListSymbol === "- "
                    ? "bg-neutral-300 dark:bg-neutral-700"
                    : ""
                }`}
                onClick={() => {
                  insertMarkdownSymbol("- ");
                }}
                size="icon"
                variant="ghost"
              >
                <FaListUl />
              </Button>
              <Button
                className={`text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none ${
                  activeListSymbol === "1. "
                    ? "bg-neutral-300 dark:bg-neutral-700"
                    : ""
                }`}
                onClick={() => {
                  insertMarkdownSymbol("1. ");
                }}
                size="icon"
                variant="ghost"
              >
                <FaListOl />
              </Button>
              <Button
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                onClick={() => {
                  insertMarkdownSymbol("[]()");
                }}
                size="icon"
                variant="ghost"
              >
                <FaLink />
              </Button>
              <Button
                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:ring-0 focus:outline-none"
                onClick={() => {
                  insertMarkdownSymbol("![]()");
                }}
                size="icon"
                variant="ghost"
              >
                <FaImage />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "markdown-content text-neutral-900 dark:text-neutral-300",
            !canEdit && "border-none select-none",
          )}
          onClick={() => {
            if (canEdit) setIsEditing(true);
          }}
          onKeyDown={(e) => {
            if (canEdit && (e.key === "Enter" || e.key === " ")) {
              setIsEditing(true);
            }
          }}
          role="button"
          style={{ cursor: canEdit ? "pointer" : "default" }}
          tabIndex={0}
        >
          <ReactMarkdown components={markdownComponents}>
            {block.props.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- BlockNote render props are dynamically typed
    render: (props: any) => <MarkdownRenderer {...props} />,
  },
);
