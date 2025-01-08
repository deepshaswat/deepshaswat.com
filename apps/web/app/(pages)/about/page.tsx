import { About } from "@repo/ui/web";
import { generateSiteConfig } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

export const metadata: Metadata = generateSiteConfig(
  "About // Shaswat Deep",
  "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  "/about",
  "/static/images/headShot.svg"
);

const AboutPage = () => {
  return <About />;
};

export default AboutPage;
