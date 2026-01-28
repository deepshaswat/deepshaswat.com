"use client";

import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { Divider, Youtube, Callout, Markdown } from "./blocks";

/**
 * Shared BlockNote schema with custom block specifications.
 * Used by both editor and renderer components for consistency.
 */
export const blocknoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtube: Youtube,
    markdown: Markdown,
    callout: Callout,
    divider: Divider,
  },
});

export type BlockNoteEditorType = typeof blocknoteSchema.BlockNoteEditor;
