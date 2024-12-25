"use client";

import { books } from "@repo/store";
import { Base } from "@repo/ui/web";
import type { Metadata } from "next";

const pageConfig = {
  tagline: "Books. Reads. Knowledge.",
  primaryColor: "purple" as const,
  secondaryColor: "pink" as const,
};

export function Library() {
  function renderAll() {
    return books.map((category, index) => (
      <div key={index} className='mb-2'>
        <h2 className='text-primary font-bold text-2xl'>{category.name}</h2>
        <ul className='list-disc mb-12'>
          {category.items.map((item, iIndex) => (
            <li key={iIndex} className='ml-10'>
              <a
                href={item.url}
                target='_blank'
                className='text-neutral-200 hover:text-neutral-300 text-sm underline underline-offset-4'
              >
                {item.title}
              </a>
              <span> - </span>
              <span
                className='text-sm underline-links italic'
                dangerouslySetInnerHTML={{ __html: item.author }}
              />
              <p className='text-sm'>
                {item.language}
                {item.description !== "" && (
                  <>
                    <span> - </span>
                    <span
                      className='text-sm underline-links italic'
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

  return (
    <Base
      title='Library // Shaswat Deep'
      description=''
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      {renderAll()}
    </Base>
  );
}
