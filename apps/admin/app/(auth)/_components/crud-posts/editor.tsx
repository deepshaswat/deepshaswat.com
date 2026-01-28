"use client";

import { BlockNoteEditor } from "@repo/ui/blocknote";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps): JSX.Element {
  return (
    <BlockNoteEditor
      editable={editable}
      initialContent={initialContent}
      onChange={onChange}
      uploadEndpoint="/api/upload"
    />
  );
}

export default Editor;
