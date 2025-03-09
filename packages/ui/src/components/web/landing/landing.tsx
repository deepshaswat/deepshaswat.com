"use client";

import Link from "next/link";
import { ShortcutHome } from "@repo/ui/web";

export const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-20vh)] sm:min-h-[calc(100vh-12vh)] flex items-center justify-start max-w-screen-sm md:max-w-screen-md  ">
      <div className="flex flex-col justify-center items-start ml-6 md:mx-auto">
        <h1 className="text-2xl sm:text-5xl font-bold mb-12 px-4">
          Shaswat Deep
        </h1>
        <h3 className="text-lg font-normal px-4 mb-2 ">
          Founder & CEO at{" "}
          <Link
            href={"https://ratecreator.com"}
            className="underline underline-offset-4 hover:text-neutral-400 "
            target="_blank"
          >
            Rate Creator
          </Link>
        </h3>
        <h4 className="text-lg font-noraml text-slate-500 px-4 mb-8">
          A platform to Discover and Review Content Creators
          {/* 
          1. Content Creator Review Platform for <em> YouTube, Instagram, X (Twitter)</em> and more.
          2. Building the future of content interaction
          */}
        </h4>
        <ShortcutHome />
      </div>
    </div>
  );
};
