"use client";

import axios from "axios";
import { useTheme } from "next-themes";
import {
  PartialBlock,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { FaYoutube, FaMarkdown, FaLightbulb } from "react-icons/fa";
import { Minus } from "lucide-react";

import { Markdown, Youtube, Callout, Divider } from "@repo/ui";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtube: Youtube,
    markdown: Markdown,
    callout: Callout,
    divider: Divider,
  },
});

const insertYoutube = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Youtube",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "youtube",
    });
  },
  group: "EMBEDS",
  icon: <FaYoutube />,
  aliases: ["youtube", "yt"],
  subtext: "Used to embed a youtube video.",
});

const insertMarkdown = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Markdown",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "markdown",
    });
  },
  group: "EMBEDS",
  icon: <FaMarkdown />,
  aliases: ["markdown", "md"],
  subtext: "Used to add a markdown editor block.",
});

const insertCallout = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Callout",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "callout",
    });
  },
  group: "Media",
  icon: <FaLightbulb />,
  aliases: ["callout", "call"],
  subtext: "Used to add a callout block.",
});

const insertDivider = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Divider",
  onItemClick: () => {
    const block = editor.getTextCursorPosition().block;
    editor.insertBlocks([{ type: "divider" }], block, "before");
  },
  group: "Other",
  icon: <Minus />,
  aliases: ["divider", "line"],
  subtext: "Insert a horizontal divider.",
});

const getCustomSlashMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertYoutube(editor),
  insertMarkdown(editor),
  insertCallout(editor),
  insertDivider(editor),
];

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  // uncomment the initialContent to avoid the error on Markdown to Blocks
  // const [markdown, setMarkdown] = useState<string | undefined>(initialContent);

  const handleUpload = async (file: File) => {
    try {
      const { data } = await axios.post("/api/upload", {
        fileType: file.type,
      });

      const { uploadURL, s3URL } = data;

      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return s3URL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const editor = useCreateBlockNote({
    // comment the initialContent to avoid the error on Markdown to Blocks
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
        // uncomment the onChange to avoid the error on Markdown to Blocks
        // onChange={onChangeMarkdown}
        slashMenu={false}
        data-theming-css-demo
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
