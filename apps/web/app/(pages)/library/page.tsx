import { Metadata } from "next";

import { Library } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Library // Shaswat Deep";
const description =
  "I'm all about <strong> learning for life</strong>, and I think the best <em>(and cheapest)</em> way to tap into the world’s wisdom  is <strong> through books</strong>. This is not just a static page — it's <strong>a living document</strong> of every book I've collected so far.<br /> <br />Collect books, even if you don't plan <strong>on reading </strong>them right away. Nothing is more important than <strong>an unread library.</strong><br /><em> -- <a href='https://en.wikipedia.org/wiki/John_Waters' target='_blank' class='underline hover:text-primary underline-offset-[5px]'>John Waters</a></em>";
const link = "https://deepshaswat.com/library";
const image = "/static/images/library.jpg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName,
    url: link,
    locale,
    type,
  },
  twitter: {
    card: twitterCard,
    title,
    description,
    images: [image],
  },
};

const LibraryPage = () => {
  return <Library />;
};

export default LibraryPage;
