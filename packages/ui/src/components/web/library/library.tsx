"use client";

import Head from "next/head";
import { books } from "@repo/store";
import { Base } from "@repo/ui/web";

async function getStaticProps() {
  const meta = {
    title: "Library // Shaswat Deep",
    description:
      "I'm all about <strong> learning for life</strong>, and I think the best <em>(and cheapest)</em> way to tap into the world’s wisdom  is <strong> through books</strong>. This is not just a static page — it's <strong>a living document</strong> of every book I've collected so far.<br /> <br />Collect books, even if you don't plan <strong>on reading </strong>them right away. Nothing is more important than <strong>an unread library.</strong><br /><em> -- <a href='https://en.wikipedia.org/wiki/John_Waters' target='_blank' class='underline hover:text-primary underline-offset-[5px]'>John Waters</a></em>",
    tagline: "Ideas. Mentors. Help. ",
    // TODO: Add image of library
    image: "/static/images/reminder-bw.jpg",
    primaryColor: "pink",
    secondaryColor: "red",
  };

  return { props: meta };
}

export const Library = async () => {
  const { props } = await getStaticProps();
  const { title, description, image } = props;

  const renderAll = () => {
    return books.map((category, index) => {
      return (
        <div key={index} className="mb-2">
          <h2 className="text-primary font-bold text-2xl">{category.name}</h2>
          <ul className="list-disc mb-12 ">
            {category.items.map((item, iIndex) => {
              return (
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
                    className={`text-sm underline-links italic`}
                    dangerouslySetInnerHTML={{ __html: item.author }}
                  />
                  <p className="text-sm ">
                    {item.language}
                    {item.description !== "" && (
                      <>
                        <span> - </span>
                        <span
                          className={`text-sm underline-links italic`}
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </>
                    )}
                  </p>
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
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://deepshaswat.com/reminder" property="og:url" />
        <meta content={`https://deepshaswat.com${image}`} property="og:image" />
      </Head>

      <Base {...props}>{renderAll()}</Base>
    </>
  );
};
