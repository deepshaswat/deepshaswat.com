import { Metadata } from "next";

import { generateSiteConfig } from "@repo/ui/web";
import { Library } from "@repo/ui/web";

export const metadata: Metadata = generateSiteConfig(
  "Library // Shaswat Deep",
  "I'm all about <strong> learning for life</strong>, and I think the best <em>(and cheapest)</em> way to tap into the world’s wisdom  is <strong> through books</strong>. This is not just a static page — it's <strong>a living document</strong> of every book I've collected so far.<br /> <br />Collect books, even if you don't plan <strong>on reading </strong>them right away. Nothing is more important than <strong>an unread library.</strong><br /><em> -- <a href='https://en.wikipedia.org/wiki/John_Waters' target='_blank' class='underline hover:text-primary underline-offset-[5px]'>John Waters</a></em>",
  "/about",
  "/static/images/reminder-bw.jpg"
);

const LibraryPage = () => {
  return <Library />;
};

export default LibraryPage;
