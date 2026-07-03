// BlockNote Editor - Centralized components for rich text editing
// Used by both admin (editor) and web (renderer) applications

// Core schema
export { blocknoteSchema, type BlockNoteEditorType } from "./schema";

// Editor component (for admin/content creation)
export { BlockNoteEditor, type BlockNoteEditorProps } from "./editor";
export { BlockNoteEditor as default } from "./editor";

// Renderer component (for web/content display)
export { BlockNoteRenderer, type BlockNoteRendererProps } from "./renderer";

// Email conversion utility
export {
  NewsletterMarkdown,
  useNewsletterMarkdown,
  type NewsletterMarkdownProps,
} from "./email-converter";

// Custom block specifications
export { Divider, Youtube, Callout, Markdown } from "./blocks";
