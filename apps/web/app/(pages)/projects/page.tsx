import { Metadata } from "next";

import { Projects } from "@repo/ui/web";

export const revalidate = 31536000;

const title = "Projects // Shaswat Deep";
const description =
  "I'm obsessed with side projects and <strong>building in public</strong>. Here you can navigate to <strong>73 different</strong> websites, apps, and libraries I built. Some projects are still active, others have been discontinued.";
const link = "https://deepshaswat.com/projects";
const image = "https://deepshaswat.com/static/images/projects.jpeg";
const siteName = "Shaswat Deep";
const locale = "en_US";
const type = "website";
const twitterCard = "summary_large_image";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title,
    description,
    siteName,
    url: link,
    locale,
    type,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: twitterCard,
    title,
    description,
    images: [image],
  },
};

const ProjectPage = () => {
  return <Projects />;
};

export default ProjectPage;
