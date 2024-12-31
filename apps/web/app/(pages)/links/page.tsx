import { Metadata } from "next";

import { generateSiteConfig, LinksComponent } from "@repo/ui/web";

export const metadata: Metadata = generateSiteConfig(
  "Links // Shaswat Deep",
  "Links to social media profiles, companies and other websites of Shaswat Deep.",
  "/links",
  "/static/images/headshot.svg",
);

const LinksPage = () => {
  return <LinksComponent />;
};

export default LinksPage;
