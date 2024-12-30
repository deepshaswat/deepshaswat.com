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
          let blockMarkdown = "";

          switch (block.type) {
            case "youtube":
              // Extract video ID from URL
              const videoId = block.props.url.split("/embed/")[1];
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
              blockMarkdown = `
<table style="width: 100%; border-spacing: 0; margin: 16px 0;">
  <tr>
    <td style="text-align: center;">
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="display: inline-block; text-decoration: none;">
        <img src="${thumbnailUrl}" alt="YouTube Video" style="max-width: 100%; height: auto; border-radius: 8px;" />
        <div style="position: relative; margin-top: -40px; margin-bottom: 20px;">
          <p style="margin: 8px 0 0; color: #ffffff; text-align: center; font-size: 14px; font-weight: bold;">Click to watch on YouTube</p>
        </div>
      </a>
    </td>
  </tr>
</table>`;
              break;
            case "video":
              blockMarkdown = `
<table style="width: 100%; border-spacing: 0; margin: 16px 0;">
  <tr>
    <td style="text-align: center;">
      <div style="position: relative;">
        <a href="${block.props.url}" target="_blank" style="text-decoration: none;">
          <div style="background-color: #000000; border-radius: 8px; overflow: hidden; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; padding: 0;">
            <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <div style="width: 72px; height: 72px; background-color: rgba(0, 0, 0, 0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.8);">
                <div style="width: 0; height: 0; border-left: 24px solid white; border-top: 16px solid transparent; border-bottom: 16px solid transparent; margin-left: 6px;"></div>
              </div>OR
            </div>
          </div>
          <p style="margin: 12px 0 4px; color: #ffffff; text-align: center; font-size: 14px; font-weight: 500;">Click to watch video</p>
          ${block.props.caption ? `<p style="margin: 0; color: #666666; text-align: center; font-size: 12px;">${block.props.caption}</p>` : ""}
        </a>
      </div>
    </td>
  </tr>
</table>`;
              break;
            case "callout":
              blockMarkdown = `
<table style="width: 100%; border-spacing: 0; margin: 16px 0;">
  <tr>
    <td style="background-color: ${block.props.bgColor}; color: ${block.props.textColor}; padding: 16px; border-radius: 8px;">
      ${block.props.showEmoji ? `<span style="margin-right: 8px; font-size: 1.2em;">${block.props.emoji}</span>` : ""}${block.props.text}
    </td>
  </tr>
</table>`;
              break;
            case "divider":
              blockMarkdown = `<hr style="border: none; border-top: 1px solid #333333; margin: 24px 0;" />`;
              break;
            case "markdown":
              blockMarkdown = `\n\`\`\`markdown\n${block.props.content || ""}\n\`\`\`\n`;
              break;
            case "table":
              const tableContent = await editor.blocksToMarkdownLossy([block]);
              // Convert markdown table to HTML table with proper styling
              const rows = tableContent
                .split("\n")
                .filter(
                  (row) =>
                    row.trim() && !row.includes("---") && !row.includes("---")
                ) // Remove empty rows and separator rows
                .map((row) => row.trim());

              const tableRows = rows
                .map((row) => {
                  const cells = row
                    .split("|")
                    .filter((cell) => cell.trim()) // Remove empty cells from split
                    .map((cell) => cell.trim()); // Clean up whitespace

                  if (cells.length === 0) return ""; // Skip empty rows

                  return `<tr>
                    ${cells.map((cell) => `<td style="padding: 12px; color: #ffffff; border: 1px solid #333333;">${cell}</td>`).join("")}
                  </tr>`;
                })
                .filter((row) => row) // Remove any empty rows we might have created
                .join("\n");

              blockMarkdown = `
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; background-color: #111111; border: 1px solid #333333;">
  ${tableRows}
</table>`;
              break;
            default:
              // Handle default blocks with their alignment and formatting
              const defaultMarkdown = await editor.blocksToMarkdownLossy([
                block,
              ]);

              // Type assertion for block props
              type BlockProps = {
                textAlignment?: "left" | "center" | "right" | "justify";
                backgroundColor?: string;
                textColor?: string;
              };
              const props = block.props as BlockProps;
              const alignment = props.textAlignment || "left";
              const bgColor =
                props.backgroundColor === "default"
                  ? "#111111"
                  : props.backgroundColor;
              const textColor =
                props.textColor === "default" ? "#ffffff" : props.textColor;

              // Convert markdown to HTML with proper styling
              let processedMarkdown = defaultMarkdown;

              // Handle quotes (they come as > prefixed text in default markdown)
              if (
                block.type === "paragraph" &&
                defaultMarkdown.trim().startsWith(">")
              ) {
                processedMarkdown = `
<table style="width: 100%; border-spacing: 0; margin: 16px 0;">
  <tr>
    <td style="padding: 16px 24px; background-color: ${bgColor || "#111111"}; border-left: 4px solid #333333; border-radius: 4px;">
      <p style="color: ${textColor || "#d4d4d4"}; font-style: italic; margin: 0; font-size: 16px; line-height: 1.6;">${defaultMarkdown.substring(1).trim()}</p>
    </td>
  </tr>
</table>`;
              }

              // Handle code blocks
              else if (defaultMarkdown.includes("```")) {
                processedMarkdown = defaultMarkdown.replace(
                  /```(.*?)\n([\s\S]*?)```/g,
                  `<pre style="background-color: ${bgColor || "#111111"}; padding: 16px; border-radius: 8px; overflow-x: auto; color: ${textColor || "#d4d4d4"}; font-family: monospace; font-size: 14px; line-height: 1.5; margin: 16px 0;">$2</pre>`
                );
              }

              // Apply alignment and colors if needed
              if (alignment !== "left" || bgColor || textColor) {
                blockMarkdown = `<div style="text-align: ${alignment}; ${bgColor ? `background-color: ${bgColor};` : ""} ${textColor ? `color: ${textColor};` : "color: #ffffff;"} border-radius: 4px;">\n\n${processedMarkdown}\n</div>`;
              } else {
                blockMarkdown = `<div style="color: #ffffff;">${processedMarkdown}</div>`;
              }
          }

          markdownContent += blockMarkdown + "\n";
        }

        // Clean up extra newlines
        markdownContent = markdownContent.replace(/\n{3,}/g, "\n\n").trim();

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
