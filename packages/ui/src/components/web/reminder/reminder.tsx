"use client";

import Head from "next/head";
import { Base } from "@repo/ui/web";

async function getStaticProps() {
  const meta = {
    title: "Reminder // Shaswat Deep",
    description:
      "Time is the only thing that is finite. Rest all things can be bought, sold, or created. So, make the most of it.",
    tagline: "Tick-tock. Tick-tock.",
    image: "/static/images/reminder-bw.jpg",
    primaryColor: "cyan",
    secondaryColor: "purple",
  };

  return { props: meta };
}

export const Reminder = async () => {
  const { props } = await getStaticProps();
  const { title, description, image, tagline, primaryColor, secondaryColor } =
    props;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://deepshaswat.com/reminder" property="og:url" />
        <meta content={`https://deepshaswat.com${image}`} property="og:image" />
      </Head>
      <Base
        title={title}
        description=""
        tagline={tagline}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      >
        <div className="justify-start gap-x-2">
          <p className="font-light  text-justify">
            <span className="text-neutral-200">
              The cycle of life keeps on going.
            </span>{" "}
            From child to parent to grandparent.{" "}
            <span className="text-neutral-200">
              You learn, then you grow and then you teach.{" "}
            </span>
            In between life happens - Education, Work, Relationships, Marriage
            and Kids.{" "}
            <span className="text-neutral-200">
              The purpose of life becomes constant for almost everyone - Money.
            </span>{" "}
            True, it is required for the survival in the world but money is
            unlimited.{" "}
            <span className="text-neutral-200">
              Time on the otherhand is most important asset.
            </span>{" "}
            It was Maths which led me to the realisation when I mapped the Time
            I have spent with my parents and what time is left to spend them.{" "}
            <span className="text-neutral-200">
              Time I have left to be alive on this blue rock.
            </span>{" "}
            This hit me so hard that I stopped the Hamster wheel almost
            instantly.{" "}
            <span className="text-neutral-200">
              Work is not life but just a part of life.
            </span>{" "}
            Living your dream with people you love should have the highest
            priority. Life is too short to earn money by spending time on things
            you don&apos;t want.{" "}
            <span className="text-neutral-200">
              Do what you want to do and do it now.
            </span>{" "}
            The countdown never stops. And it never waits.{" "}
          </p>
          <p className="font-light">
            <br />
            <em>- by Shaswat</em>
          </p>
        </div>
      </Base>
    </>
  );
};
