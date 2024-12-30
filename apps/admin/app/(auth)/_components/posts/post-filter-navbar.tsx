"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@repo/ui";

const capitalizeFirstLetter = (item: string) => {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase()
    )
    .join(" ");
};

interface PostFilterNavbarProps {
  postOption: string;
  onSelectPostOption: (item: string) => void;
  tagOption: string;
  onSelectTagOption: (item: string) => void;
  tags: string[];
  postFilter: string[];
}

const PostFilterNavbar = ({
  postOption,
  onSelectPostOption,
  tagOption,
  onSelectTagOption,
  tags,
  postFilter,
}: PostFilterNavbarProps) => {
  return (
    <>
      <div className="">
        <SelectComponent
          items={postFilter}
          placeholder="all-posts"
          onSelect={onSelectPostOption}
          selectedItem={postOption}
        />
      </div>
      <div className="mr-1 text-[11px] md:text-[12px]">All access</div>
      <div className="mr-1 text-[11px] md:text-[12px] ">All authors</div>
      <div className="mr-1">
        <SelectComponent
          items={tags}
          placeholder="all-tags"
          onSelect={onSelectTagOption}
          selectedItem={tagOption}
        />
      </div>
      <div>Newest first</div>
    </>
  );
};

export default PostFilterNavbar;

interface SelectComponentProps {
  placeholder: string;
  items: string[];
  onSelect: (item: string) => void;
  selectedItem: string;
}

const SelectComponent = ({
  placeholder,
  items,
  onSelect,
  selectedItem,
}: SelectComponentProps) => {
  const handleSelect = (item: string) => {
    onSelect(item);
  };

  return (
    <Select onValueChange={handleSelect}>
      <div
        className={`${
          selectedItem && selectedItem !== placeholder
            ? "text-green-500 bg-neutral-800 rounded-sm"
            : "text-neutral-200"
        }`}
      >
        <SelectTrigger className="ml-2 bg-transparent border-transparent ring-0 outline-none focus:ring-0 focus:outline-none  text-[11px] md:text-[12px]">
          {capitalizeFirstLetter(selectedItem) ||
            capitalizeFirstLetter(placeholder)}
        </SelectTrigger>{" "}
      </div>
      <SelectContent className="pl-0 bg-neutral-800 border-transparent ring-0 outline-none focus:ring-0 focus:outline-none">
        <SelectGroup className="pl-0 bg-neutral-800 ">
          {items.map((item) => (
            <SelectItem
              key={item}
              className="text-neutral-200 border-transparent hover:bg-neutral-950 hover:text-neutral-200 text-[11px] md:text-[12px] font-light !justify-start focus:ring-0 focus:outline-none focus:bg-neutral-950 focus:text-neutral-200 pr-5 "
              value={item}
              onClick={() => handleSelect(item)}
            >
              {capitalizeFirstLetter(item)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
