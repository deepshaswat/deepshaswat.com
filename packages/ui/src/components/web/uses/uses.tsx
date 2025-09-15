"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { categories } from "@repo/store";
import { Base } from "@repo/ui/web";

const pageConfig = {
  tagline: "Apps. Tools. Gear.",
  primaryColor: "yellow" as const,
  secondaryColor: "pink" as const,
};

export function Uses() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1);
  }, []);

  function renderAll() {
    return categories.map((category, index) => (
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
                className='text-sm underline-links text-neutral-400'
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </li>
          ))}
        </ul>
      </div>
    ));
  }

  return isLoading ? (
    <div className='flex flex-row mt-10 items-center justify-center h-screen'>
      <Loader2 className='size-16 animate-spin' />
    </div>
  ) : (
    <Base
      title='Uses // Shaswat Deep'
      description=''
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      <p className='text-neutral-400 text-md mb-12 mt-12 font-thin'>
        I often get messages asking about specific pieces of{" "}
        <strong className='text-neutral-200'>software or hardware</strong> I
        use. This not a static page, it's a{" "}
        <strong className='text-neutral-200'>living document</strong> with
        everything that I'm using nowadays.
      </p>
      {renderAll()}
    </Base>
  );
}
