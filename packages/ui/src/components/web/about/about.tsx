"use client";

import { items } from "@repo/store";
import { parseISO, format, intervalToDuration } from "date-fns";
import Head from "next/head";
import { Base } from "@repo/ui/web";
import Image from "next/image";

export async function generateMetadata() {
  const meta = {
    title: "About // Shaswat Deep",
    description:
      "Shaswat Deep is an Indian software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
    tagline: "Learn. Build. Repeat.",
    image: "/static/images/about-bw.jpg",
    primaryColor: "pink",
    secondaryColor: "purple",
  };
  return { props: meta };
}

export const About = async () => {
  const { props } = await generateMetadata();
  const { title, description, image, tagline, primaryColor, secondaryColor } =
    props;

  const renderIntro = () => {
    const size = 1048;
    return (
      <div className='flex flex-col md:flex-row '>
        <div className='flex-1 pt-3 size-1048'>
          <Image
            alt='Shaswat'
            src='/static/images/headShot.svg'
            width={size}
            height={size}
            className='rounded-lg'
          />
        </div>
        <div className='flex-1 md:pl-12  text-lg md:text-sm'>
          <p className='p-4 leading-relaxed tracking-wide'>
            <strong className='text-primary'>Hey, I&apos;m Shaswat Deep</strong>{" "}
            I started as a software engineer back in 2013, working with
            automation testing.
          </p>
          <p className='p-4 leading-relaxed tracking-wide'>
            I&apos;m the <strong className='text-primary'>Founder & CEO</strong>{" "}
            at Orbizza. Before that, I was Senior Staff Engineer at Harness and
            Senior Engineer at AppDynamics.
            {/* I&apos;m from India and now living
            with my family in a small town. */}
          </p>
          <p className='p-4 leading-relaxed tracking-wide'>
            <strong className='text-primary'>I love dark mode</strong>,
            researching stocks, and side projects. When I&apos;m not working, I
            like reading books, watching animes, and{" "}
            <strong className='text-primary'>cooking</strong>.
          </p>
        </div>
      </div>
    );
  };
  const renderAll = () => {
    return items.map((item, index) => {
      return (
        <div key={index} className='mb-12'>
          <h3 className='text-primary font-bold text-xl'>{item.jobTitle}</h3>
          <p style={{ margin: 0 }}>
            <a
              href={item.companyUrl}
              target='_blank'
              className='text-neutral-200 hover:text-neutral-300 text-sm underline underline-offset-4'
            >
              {item.company}
            </a>
            <span className={`text-sm `}> • {item.location}</span>
          </p>
          <p>
            <span className={`text-sm `}>
              {format(parseISO(item.startDate), "LLL yyyy")}
            </span>
            <span className={`text-sm `}> – </span>
            <span className={`text-sm `}>
              {item.endDate
                ? format(parseISO(item.endDate), "LLL yyyy")
                : "Present"}
            </span>
            <span className={`text-sm `}> • </span>
            <span className={`text-sm `}>
              {getDuration(item.startDate, item.endDate || "")}
            </span>
          </p>
        </div>
      );
    });
  };
  const getDuration = (startDate: string, endDate: string): string => {
    const end = endDate !== "" ? parseISO(endDate) : new Date();
    const start = parseISO(startDate);
    const durationObj = intervalToDuration({ start, end });

    let durationStr = "";

    if (durationObj.years ?? 0 > 0) {
      durationStr +=
        durationObj.years === 1
          ? `${durationObj.years} yr `
          : `${durationObj.years} yrs `;
    }

    if (durationObj.months ?? 0 > 0) {
      durationStr +=
        durationObj.months === 1
          ? `${durationObj.months} mo`
          : `${durationObj.months} mos`;
    }

    return durationStr || "0 mos";
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name='description' />
        <meta content={description} property='og:description' />
        <meta content='https://deepshaswat.com/reminder' property='og:url' />
        <meta content={`https://deepshaswat.com${image}`} property='og:image' />
      </Head>

      <Base
        title={title}
        description=''
        tagline={tagline}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      >
        {renderIntro()}
        <h2 className='text-2xl font-bold text-primary mt-12 mb-6'>Career</h2>
        {renderAll()}
      </Base>
    </>
  );
};
