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
        <p className='font-light text-neutral-400 text-justify'>
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
          </span>{" "}
          True, it is required for the survival in the world but money is
          unlimited.{" "}
          <span className='text-neutral-200'>
            Time on the otherhand is most important asset.
          </span>{" "}
          It was Maths which led me to the realisation when I mapped the Time I
          have spent with my parents and what time is left to spend them.{" "}
          <span className='text-neutral-200'>
            Time I have left to be alive on this blue rock.
          </span>{" "}
          This hit me so hard that I stopped the Hamster wheel almost instantly.{" "}
          <span className='text-neutral-200'>
            Work is not life but just a part of life.
          </span>{" "}
          Living your dream with people you love should have the highest
          priority. Life is too short to earn money by spending time on things
          you don&apos;t want.{" "}
          <span className='text-neutral-200'>
            Do what you want to do and do it now.
          </span>{" "}
          The countdown never stops. And it never waits.{" "}
        </p>
        <p className='font-light'>
          <br />
          <em>- by Shaswat</em>
        </p>
      </div>
    </Base>
  );
}
