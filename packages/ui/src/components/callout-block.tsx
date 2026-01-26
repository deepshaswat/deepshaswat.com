"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@repo/ui/utils";
import { FaPalette, FaSmile, FaFont } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

const ColorButton = ({
  color,
  onClick,
  isSelected,
}: {
  color: string;
  onClick: (color: string) => void;
  isSelected: boolean;
}) => (
  <button
    className={cn(
      "w-6 h-6 rounded-full",
      isSelected ? "ring-2 ring-white" : "",
    )}
    style={{ backgroundColor: color }}
    onClick={() => onClick(color)}
  />
);

const predefinedColors = [
  "#FFFFFF",
  "#000000",
  "#E53E3E",
  "#38A169",
  "#3182CE",
  "#D69E2E",
  "#805AD5",
  "#DD6B20",
  "#319795",
  "#B794F4",
  "#F56565",
];

export const Callout = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      text: { default: "Callout text..." },
      emoji: { default: "💡" },
      bgColor: { default: "#2D3748" },
      textColor: { default: "#FFFFFF" },
      showEmoji: { default: true },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [emoji, setEmoji] = useState(block.props.emoji);
      const [bgColor, setBgColor] = useState(block.props.bgColor);
      const [textColor, setTextColor] = useState(block.props.textColor);
      const [text, setText] = useState(block.props.text);
      const [showEmoji, setShowEmoji] = useState(block.props.showEmoji);

      // Only allow editing if the editor is editable
      const canEdit = editor.isEditable;

      useEffect(() => {
        setEmoji(block.props.emoji);
        setBgColor(block.props.bgColor);
        setTextColor(block.props.textColor);
        setText(block.props.text);
        setShowEmoji(block.props.showEmoji);
      }, [block.props]);

      const updateCallout = useCallback(
        (updates = {}) => {
          if (!canEdit) return;
          editor.updateBlock(block, {
            type: "callout",
            props: { ...block.props, ...updates },
          });
        },
        [editor, block, canEdit],
      );

      const handleEmojiClick = useCallback(
        (emojiData: EmojiClickData) => {
          const newEmoji = emojiData.emoji;
          setEmoji(newEmoji);
          updateCallout({ emoji: newEmoji });
        },
        [updateCallout],
      );

      return (
        <div
          className="flex items-start px-4 py-3 rounded-md w-full relative"
          style={{ backgroundColor: bgColor, color: textColor }}
          onMouseEnter={() => canEdit && setIsEditing(true)}
          onMouseLeave={() => canEdit && setIsEditing(false)}
        >
          {showEmoji && <span className="mr-2 text-2xl">{emoji}</span>}
          {isEditing && canEdit ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => updateCallout({ text })}
              className="bg-transparent border-none w-full text-lg font-semibold focus:outline-none"
              style={{ color: textColor }}
              autoFocus
            />
          ) : (
            <span className="w-full text-lg font-semibold">{text}</span>
          )}
          {isEditing && canEdit && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none hover:text-white">
                    <FaSmile />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-neutral-800 border-neutral-700">
                  <div className="flex flex-col space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-300">
                        Emoji
                      </span>
                      <Switch
                        checked={showEmoji}
                        onCheckedChange={(checked) => {
                          setShowEmoji(checked);
                          updateCallout({ showEmoji: checked });
                        }}
                        className={cn(
                          "peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
                          showEmoji ? "bg-green-500" : "bg-neutral-200",
                        )}
                      />
                    </div>
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.DARK}
                      width="100%"
                      height={400}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none hover:text-white">
                    <FaPalette />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4 bg-neutral-800 border-neutral-700">
                  <div className="flex flex-col space-y-3">
                    <span className="text-neutral-300 text-sm font-medium">
                      Background color
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map((color) => (
                        <ColorButton
                          key={color}
                          color={color}
                          onClick={(selectedColor: string) => {
                            setBgColor(selectedColor);
                            updateCallout({ bgColor: selectedColor });
                          }}
                          isSelected={color === bgColor}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none hover:text-white">
                    <FaFont />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4 bg-neutral-800 border-neutral-700">
                  <div className="flex flex-col space-y-3">
                    <span className="text-neutral-300 text-sm font-medium">
                      Text color
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map((color) => (
                        <ColorButton
                          key={color}
                          color={color}
                          onClick={(selectedColor: string) => {
                            setTextColor(selectedColor);
                            updateCallout({ textColor: selectedColor });
                          }}
                          isSelected={color === textColor}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      );
    },
  },
);
