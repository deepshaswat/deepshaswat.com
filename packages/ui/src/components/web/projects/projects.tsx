"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Heart,
  Mail,
  Clipboard,
  Code,
  CandlestickChart,
  GraduationCap,
  Clapperboard,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { featuredProjects, allProjects } from "@repo/store";
import { Base } from "../posts/BaseStatic";

const pageConfig = {
  tagline: "Work. Hobby. Open Source.",
  primaryColor: "cyan" as const,
  secondaryColor: "blue" as const,
};

const iconMap: Record<string, React.ReactNode> = {
  "chart-candlestick": <CandlestickChart className="size-8" />,
  "graduation-cap": <GraduationCap className="size-8" />,
  clapperboard: <Clapperboard className="size-8" />,
  star: <Star className="size-8" />,
};

interface FeaturedProjectCardProps {
  project: {
    name: string;
    description: string;
    url: string;
    stats: string;
    icon: string;
  };
  index: number;
}

const FeaturedProjectCard = ({ project, index }: FeaturedProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative flex flex-col h-full p-6 transition-all duration-200">
        <div className="mb-4 text-neutral-400 transition-colors">
          {iconMap[project.icon]}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-200">
          {project.name}
        </h3>
        <p className="mb-4 flex-grow text-sm text-neutral-400">
          {project.description}
        </p>
        <p className="text-xs font-medium tracking-wide text-neutral-500">
          {project.stats}
        </p>
      </div>
    </a>
  );
};

export function Projects() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1);
  }, []);

  function renderFeaturedProjects() {
    return (
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-primary">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    );
  }

  function renderAllProjects() {
    return (
      <div>
        <h2 className="mb-8 text-2xl font-bold text-primary">All Projects</h2>
        {allProjects.map((yearGroup, index) => (
          <div key={index} className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-neutral-200">
              {yearGroup.year}
            </h3>
            <ul className="mb-8 list-disc">
              {yearGroup.projects.map((project, pIndex) => (
                <li key={pIndex} className="ml-10">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-200 underline underline-offset-4 hover:text-neutral-300"
                  >
                    {project.name}
                  </a>
                  {project.description && (
                    <>
                      <span className="text-neutral-400"> - </span>
                      <span className="text-sm text-neutral-400">
                        {project.description}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return isLoading ? (
    <div className="mt-10 flex h-screen flex-row items-center justify-center">
      <Loader2 className="size-16 animate-spin" />
    </div>
  ) : (
    <Base
      title="Projects // Shaswat Deep"
      description=""
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      <p className="mb-12 mt-12 text-md font-thin text-neutral-400">
        I&apos;m obsessed with building products and{" "}
        <strong className="text-neutral-200">building in public</strong>. Here
        you can navigate to{" "}
        <strong className="text-neutral-200">73 different</strong> websites,
        apps, and libraries I built and worked on. Some projects are still
        active, others have been discontinued.
      </p>
      {renderFeaturedProjects()}
      {renderAllProjects()}
    </Base>
  );
}
