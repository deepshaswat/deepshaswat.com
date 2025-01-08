import { Metadata } from "next";

import { generateSiteConfig } from "@repo/ui/web";
import { Uses } from "@repo/ui/web";

export const revalidate = 31536000;
export const metadata: Metadata = generateSiteConfig(
  "Uses // Shaswat Deep",
  "I often get messages asking about specific pieces of <strong>software or hardware I use</strong>. This not a static page, it's a <strong>living document</strong> with everything that I'm using nowadays.",
  "/uses",
  "/static/images/reminder-bw.jpg"
);

const UsesPage = () => {
  return <Uses />;
};

export default UsesPage;
