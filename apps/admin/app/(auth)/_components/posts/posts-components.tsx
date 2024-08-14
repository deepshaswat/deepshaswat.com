"use client";

import { Button, Label } from "@repo/ui";
import Link from "next/link";
import PostFilterNavbar from "./post-filter-navbar";
import { useState } from "react";

import { cn } from "@repo/ui/utils";

const PostsComponent = () => {
  const [postOption, setPostOption] = useState("");
  const [tagOption, setTagOption] = useState("");

  const handleSelectPostOption = (item: string) => {
    setPostOption(item);
  };

  const handleSelectTagOption = (item: string) => {
    setTagOption(item);
  };

  return (
    <div className='m-8 lg:ml-[156px] lg:mr-[156px] '>
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center '>
        <div className='flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0 '>
          <Label htmlFor='' className='text-3xl font-semibold'>
            Posts
          </Label>
          <div className='flex flex-row gap-20  justify-start '>
            <div className='flex flex-row items-center space-x-8  ml-10 max-w-0 lg:max-w-full overflow-hidden text-neutral-200 font-light text-sm'>
              <PostFilterNavbar
                onSelectPostOption={handleSelectPostOption}
                postOption={postOption}
                onSelectTagOption={handleSelectTagOption}
                tagOption={tagOption}
              />
            </div>
            <Link href='/new-post' className='items-center'>
              <Button variant='secondary' className='rounded-sm items-center'>
                New post
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 ml-14 mr-4 flex flex-row items-center justify-end space-x-8 overflow-hidden max-w-full lg:invisible font-light text-sm text-neutral-200"
            // `${selectedItem ? "text-red-500" : "text-neutral-200"}`
          )}
        >
          <PostFilterNavbar
            onSelectPostOption={handleSelectPostOption}
            postOption={postOption}
            onSelectTagOption={handleSelectTagOption}
            tagOption={tagOption}
          />
        </div>
      </div>

      <div className='mt-16'>List of items</div>
    </div>
  );
};

export default PostsComponent;
