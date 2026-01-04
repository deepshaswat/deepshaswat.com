"use client";

import Link from "next/link";
import { ShortcutHome } from "@repo/ui/web";

export const Landing = () => {
  return (
    <div className='min-h-[calc(100vh-20vh)] sm:min-h-[calc(100vh-12vh)] flex items-center justify-start max-w-screen-sm mx-auto'>
      <div className='flex flex-col justify-center items-start ml-6 '>
        <h1 className='text-2xl sm:text-5xl font-bold mb-12 px-4'>
          Shaswat Deep
        </h1>
        <h3 className='text-lg font-normal px-4 mb-2 '>
          Builder.
          <br /> Entrepreneur.
          <br /> Conspiracy Theorist.
          <br /> Stock Market Trader &amp; Investor.
          {/* <Link
            href={"https://ratecreator.com"}
            className="underline underline-offset-4 hover:text-neutral-400 "
            target="_blank"
          >
            Rate Creator
          </Link> */}
        </h3>
        <h4 className='text-lg font-normal text-neutral-400 px-4 mb-8 mt-8'>
          Check out the list of{" "}
          <Link
            href='/projects'
            className='underline underline-offset-4 text-neutral-200 hover:text-neutral-400 '
          >
            featuredprojects
          </Link>{" "}
          that I&apos;m working on.
          <br /> <br /> You can read my{" "}
          <Link
            href='/articles'
            className='underline underline-offset-4 text-neutral-200 hover:text-neutral-400 '
          >
            articles
          </Link>{" "}
          about tech, stocks and conspiracy theories.
        </h4>
        <ShortcutHome />
      </div>
    </div>
  );
};
