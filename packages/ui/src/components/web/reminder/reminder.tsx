"use client";

import { Base } from "@repo/ui/web";
import type { Metadata } from "next";

const pageConfig = {
  tagline: "Tick-tock. Tick-tock.",
  primaryColor: "cyan" as const,
  secondaryColor: "purple" as const,
};

export function Reminder() {
  return (
    <Base
      title='Reminder // Shaswat Deep'
      description=''
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      <div className='justify-start gap-x-2'>
        <p className='font-light text-justify'>
          <span className='text-neutral-200'>
            The cycle of life keeps on going.
          </span>{" "}
          From child to parent to grandparent.{" "}
          <span className='text-neutral-200'>
            You learn, then you grow and then you teach.{" "}
          </span>
          In between life happens - Education, Work, Relationships, Marriage and
          Kids.{" "}
          <span className='text-neutral-200'>
            The purpose of life becomes constant for almost everyone - Money.
          </span>
        </p>
      </div>
    </Base>
  );
}
