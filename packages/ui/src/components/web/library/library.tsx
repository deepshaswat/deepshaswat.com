"use client";

import { books } from "@repo/store";
import { Base } from "@repo/ui/web";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

const pageConfig = {
  tagline: "Books. Reads. Knowledge.",
  primaryColor: "pink" as const,
  secondaryColor: "red" as const,
};

export function Library() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1);
  }, []);

  function renderAll() {
    return books.map((category, index) => (
      <div key={index} className="mb-2">
        <h2 className="text-primary font-bold text-2xl">{category.name}</h2>
        <ul className="list-disc mb-12 text-neutral-400">
          {category.items.map((item, iIndex) => (
            <li key={iIndex} className="ml-10">
              <a
                href={item.url}
                target="_blank"
                className="text-neutral-200 hover:text-neutral-300 text-sm underline underline-offset-4"
              >
                {item.title}
              </a>
              <span> - </span>
              <span
                className="text-sm underline-links italic"
                dangerouslySetInnerHTML={{ __html: item.author }}
              />
              <p className="text-sm">
                {item.language}
                {item.description !== "" && (
                  <>
                    <span> - </span>
                    <span
                      className="text-sm underline-links italic"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    ));
  }

  return isLoading ? (
    <div className="flex flex-row mt-10 items-center justify-center h-screen">
      <Loader2 className="size-16 animate-spin" />
    </div>
  ) : (
    <Base
      title="Library // Shaswat Deep"
      description=""
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      <p className="text-neutral-400 text-md mb-12 mt-12 font-thin">
        I'm all about{" "}
        <strong className="text-neutral-200"> learning for life</strong>, and I
        think the best <em>(and cheapest)</em> way to tap into the world’s
        wisdom is <strong className="text-neutral-200"> through books</strong>.
        This is not just a static page — it's{" "}
        <strong className="text-neutral-200">a living document</strong> of every
        book I've collected so far.
        <br /> <br />
        Collect books, even if you don't plan{" "}
        <strong className="text-neutral-200">on reading </strong>them right
        away. Nothing is more important than{" "}
        <strong className="text-neutral-200">an unread library.</strong>
        <br />
        <em>
          {" "}
          --{" "}
          <a
            href="https://en.wikipedia.org/wiki/John_Waters"
            target="_blank"
            className="underline hover:text-primary underline-offset-[5px]"
          >
            John Waters
          </a>
        </em>
      </p>
      {renderAll()}
    </Base>
  );
}
