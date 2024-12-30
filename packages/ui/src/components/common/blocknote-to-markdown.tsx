"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { useState, useEffect } from "react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import {
  Markdown as MarkdownComponent,
  Youtube,
  Callout,
  Divider,
} from "@repo/ui";

interface NewsletterMarkdownProps {
  content: string;
  onMarkdownChange?: (markdown: string) => void;
}

export function NewsletterMarkdown({
  content,
  onMarkdownChange,
}: NewsletterMarkdownProps) {
  const [markdown, setMarkdown] = useState<string>("");

  // Create schema with custom block specs
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      youtube: Youtube,
      markdown: MarkdownComponent,
      callout: Callout,
      divider: Divider,
    },
  });

  // Parse the content
  let parsedContent;
  try {
    parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  } catch (error) {
    console.error("Failed to parse content:", error);
    parsedContent = [];
  }

  // Initialize editor
  const editor = useCreateBlockNote({
    initialContent: parsedContent,
    schema,
    domAttributes: {
      editor: {
        class: "focus:outline-none bg-transparent",
      },
      block: {
        class: "my-3 first:mt-6 last:mb-6 bg-transparent",
      },
    },
  });

  useEffect(() => {
    const getMarkdown = async () => {
      if (editor) {
        const blocks = editor.topLevelBlocks;
        let markdownContent = "";

        for (const block of blocks) {
          const blockMarkdown = await editor.blocksToMarkdownLossy([block]);
          markdownContent += blockMarkdown + "\n";
        }

        setMarkdown(markdownContent);
        onMarkdownChange?.(markdownContent);
      }
    };

    getMarkdown();
  }, [editor, content, onMarkdownChange]);

  return null;
}

// For backward compatibility
export const useNewsletterMarkdown = (content: string) => {
  const [markdown, setMarkdown] = useState<string>("");

  return {
    markdown,
    NewsletterMarkdown: () => (
      <NewsletterMarkdown content={content} onMarkdownChange={setMarkdown} />
    ),
  };
};
