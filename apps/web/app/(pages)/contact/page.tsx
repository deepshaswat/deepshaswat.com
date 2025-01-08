import { Contact } from "@repo/ui/web";
import { generateSiteConfig } from "@repo/ui/web";
import { Metadata } from "next";

export const revalidate = 31536000;

export const metadata: Metadata = generateSiteConfig(
  "Contact // Shaswat Deep",
  "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder & CEO of Orbizza.",
  "/contact",
  "/static/images/headShot.svg"
);

const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
