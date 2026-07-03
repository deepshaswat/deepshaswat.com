"use client";

import React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { blocknoteSchema } from "./schema";
import { parseBlockNoteContent } from "./content-utils";

export interface BlockNoteRendererProps {
  content: string | object;
  className?: string;
}

const globalStyles = `
  .bn-container {
    background-color: transparent !important;
    margin-left: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .bn-editor {
    background-color: transparent !important;
    margin-left: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .bn-editor > div {
    margin-left: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  [data-node-type="bulletListItem"],
  [data-node-type="numberedListItem"] {
    margin-left: 0 !important;
    padding-left: 1.5rem !important;
    border-left: none !important;
    position: relative !important;
  }
  [data-node-type="bulletListItem"] [data-node-type="bulletListItem"],
  [data-node-type="numberedListItem"]
    [data-node-type="numberedListItem"] {
    margin-left: 1rem !important;
    border-left: none !important;
    position: relative !important;
  }
  [data-node-type="bulletListItem"]::before {
    content: "\\2022" !important;
    position: absolute !important;
    left: 0.5rem !important;
  }
  [data-node-type="numberedListItem"]::before {
    position: absolute !important;
    left: 0.5rem !important;
  }
  [data-node-type="callout"] {
    background-color: rgb(34 197 94 / 0.2) !important;
    border-radius: 0.5rem !important;
    padding: 1rem !important;
  }
  [data-node-type="callout"] [data-content="true"] {
    color: rgb(209 213 219) !important;
  }
  /* Use the site font (Nunito via --font-sans) for article content, overriding
     BlockNote's hardcoded Inter stack on .bn-default-styles. Most visible on titles. */
  .bn-container .bn-editor,
  .bn-container .bn-default-styles,
  .bn-container [data-content-type="heading"],
  .bn-container [data-content-type="paragraph"] {
    font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif !important;
  }
  .bn-container code,
  .bn-container pre,
  .bn-container [data-content-type="codeBlock"] {
    font-family: var(--font-mono), ui-monospace, monospace !important;
  }
  /* Titles use the theme foreground colour in both light and dark, matching the
     rest of the site instead of BlockNote's muted grey / un-inverted prose colour.
     BlockNote renders the visible text in an inner h1/h2/h3 that "prose" colours
     directly, so we must target those tags (not the outer wrapper div). */
  .bn-container h1,
  .bn-container h2,
  .bn-container h3 {
    color: hsl(var(--foreground)) !important;
  }
  /* Bold text: Tailwind Typography's "prose" sets a dark --tw-prose-bold colour
     on <strong>/<b> that is not inverted for the dark theme, so every bold run
     (e.g. "Pro Annual:", "PRO is ₹249/month") renders near-invisible on the
     dark background. Inherit the surrounding text colour so bold matches the
     body text (or the link colour when bold sits inside a link). */
  .bn-container strong,
  .bn-container b {
    color: inherit !important;
  }
  /* Links: BlockNote's default renders a low-contrast slate that is nearly
     invisible on the dark theme (the pricing/roadmap/sign-up links in
     newsletters and articles). Use the site's green accent — readable in both
     themes — with an underline so links stay clearly distinguishable. */
  .bn-container a,
  .bn-container a * {
    color: #15803d !important; /* green-700 for the light theme */
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .dark .bn-container a,
  .dark .bn-container a * {
    color: #4ade80 !important; /* green-400 for the dark theme */
  }
`;

export function BlockNoteRenderer({
  content,
  className = "",
}: BlockNoteRendererProps): JSX.Element {
  const { resolvedTheme } = useTheme();

  // Parses JSON, strips ids, converts legacy callout blocks to paragraphs, and
  // returns undefined for empty content (BlockNote throws on an empty array).
  const parsedContent = parseBlockNoteContent(content);

  const editor = useCreateBlockNote({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- BlockNote content from JSON parse
    initialContent: parsedContent,
    schema: blocknoteSchema,
    domAttributes: {
      editor: {
        class: "focus:outline-none bg-transparent",
      },
      block: {
        class: "my-3 first:mt-6 last:mb-6 bg-transparent",
      },
    },
  });

  return (
    <div className={`relative w-full ${className}`}>
      <div className="prose prose-lg max-w-none ml-0 p-0">
        <div
          className="
            prose-headings:font-semibold
            prose-h1:text-4xl prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mb-3
            prose-p:text-neutral-800 dark:prose-p:text-neutral-200 prose-p:leading-8
            prose-pre:bg-transparent
            prose-pre:text-neutral-700 dark:prose-pre:text-neutral-300
            prose-blockquote:border-l-4
            prose-blockquote:border-neutral-500
            prose-blockquote:pl-4
            prose-blockquote:italic
            prose-blockquote:text-neutral-600 dark:prose-blockquote:text-neutral-400
            prose-ul:list-disc
            prose-ul:pl-6
            prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300
            prose-ol:list-decimal
            prose-ol:pl-0
            prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300
            prose-code:text-neutral-700 dark:prose-code:text-neutral-300
            prose-youtube:w-full prose-youtube:aspect-video
            prose-youtube:rounded-md prose-youtube:shadow-md
            prose-youtube:p-2
            prose-video:w-full prose-video:aspect-video
            prose-video:rounded-md prose-video:shadow-md
            prose-video:p-2
            prose-text:text-neutral-900 dark:prose-text:text-neutral-100
          "
        >
          <BlockNoteView
            className="min-h-[200px] w-full [&_*]:ml-0 [&_*]:pl-0"
            editable={false}
            editor={editor}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
          />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
    </div>
  );
}

export default BlockNoteRenderer;
