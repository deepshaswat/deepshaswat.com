// Shared parsing/sanitisation for BlockNote content used by the editor, the
// read-only renderer, and the newsletter/email converter.
//
// Responsibilities:
//  - Convert legacy "callout" blocks (the custom block was removed because it
//    crashed the editable editor with "RangeError: Position undefined out of
//    range") into plain paragraphs, preserving their text/emoji so existing
//    posts keep rendering.
//  - Strip explicit block `id`s (BlockNote regenerates them) and ensure every
//    text run carries a `styles` object.
//  - Return `undefined` (never `[]`) for empty/invalid content — BlockNote
//    throws "initialContent must be a non-empty array" on an empty array.

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- BlockNote content is dynamically-typed JSON */

export function sanitizeBlock(block: any): any {
  if (!block || typeof block !== "object") return block;

  // Legacy callout block -> paragraph (keep emoji + text as plain text).
  if (block.type === "callout") {
    const props = block.props ?? {};
    const text = [props.showEmoji ? props.emoji : "", props.text]
      .filter(Boolean)
      .join(" ")
      .trim();
    return {
      type: "paragraph",
      content: text ? [{ type: "text", text, styles: {} }] : [],
    };
  }

  const { id, ...rest } = block;
  void id; // intentionally dropped

  if (Array.isArray(rest.content)) {
    rest.content = rest.content.map((item: any) =>
      item && item.type === "text" && !item.styles
        ? { ...item, styles: {} }
        : item,
    );
  }
  if (Array.isArray(rest.children)) {
    rest.children = rest.children.map((child: any) => sanitizeBlock(child));
  }
  return rest;
}

export function parseBlockNoteContent(
  content: string | object | undefined,
): any[] | undefined {
  if (!content) return undefined;
  try {
    const raw: unknown =
      typeof content === "string" ? JSON.parse(content) : content;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((block) => sanitizeBlock(block));
    }
    return undefined;
  } catch {
    if (typeof content === "string" && content.trim()) {
      return [
        {
          type: "paragraph",
          content: [{ type: "text", text: content, styles: {} }],
        },
      ];
    }
    return undefined;
  }
}
