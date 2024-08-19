"use client";

import axios from "axios";
import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  filterSuggestionItems,
  getDefaultSlashMenuItems,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Youtube } from "@repo/ui";
import { FaYoutube } from "react-icons/fa";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtube: Youtube,
  },
});

const insertYoutube = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Youtube",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "youtube",
    });
  },
  group: "Media",
  icon: <FaYoutube />,
  aliases: ["youtube", "yt"],
  subtext: "Used to embed a youtube video.",
});

const getCustomSlashMenuItems = (
  editor: typeof schema.BlockNoteEditor,
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertYoutube(editor),
];

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    try {
      // Request presigned URL from the API route
      const { data } = await axios.post("/api/upload", {
        fileType: file.type,
      });

      const { uploadURL, s3URL } = data;

      // Upload file to S3 using the presigned URL
      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // Return the S3 URL for rendering in the editor
      return s3URL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
    schema,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => {
          onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        }}
        slashMenu={false} // Disable default slash menu to use custom menu controller
      >
        <SuggestionMenuController
          triggerCharacter="/"
          // Extending default items with the custom YouTube item
          getItems={async (query) =>
            filterSuggestionItems(
              // [...getDefaultSlashMenuItems(editor), insertYoutube(editor)],
              getCustomSlashMenuItems(editor),
              query,
            )
          }
        />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
