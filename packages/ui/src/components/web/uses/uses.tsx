"use client";

import Head from "next/head";
import { categories } from "@repo/store";
import { Base } from "@repo/ui/web";

async function getStaticProps() {
  const meta = {
    title: "Uses // Shaswat Deep",
    description:
      "I often get messages asking about specific pieces of <strong>software or hardware I use</strong>. This not a static page, it's a <strong>living document</strong> with everything that I'm using nowadays.",
    tagline: "Apps. Tools. Gear. ",
    // TODO: Add image of laptop or desktop workspace
    image: "/static/images/reminder-bw.jpg",
    primaryColor: "yellow",
    secondaryColor: "pink",
  };

  return { props: meta };
}

export const Uses = async () => {
  const { props } = await getStaticProps();
  const { title, description, image } = props;
  const renderAll = () => {
    return categories.map((category, index) => {
      return (
        <div key={index} className='mb-2'>
          <h2 className='text-primary font-bold text-2xl'>{category.name}</h2>
          <ul className='list-disc mb-12 '>
            {category.items.map((item, iIndex) => {
              return (
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
                    className={`text-sm underline-links`}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
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

      <Base {...props}>{renderAll()}</Base>
    </>
  );
};
