import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { Button } from "@repo/ui";
import {
  Github,
  Twitter,
  Instagram,
  Youtube,
  LinkedinIcon,
  ExternalLink,
  Mail,
  Send,
  Calendar,
  CodeXml,
  BriefcaseBusiness,
} from "lucide-react";

interface LinkData {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

const LinksComponent = () => {
  const links: LinkData[] = [
    {
      title: "RateCreator - Creator Review Site",
      url: "https://ratecreator.com/",
      icon: <CodeXml className='h-5 w-5' />,
    },
    {
      title: "Schedule a call with me",
      url: "https://cal.com/deepshaswat/15min",
      icon: <Calendar className='h-5 w-5' />,
    },
    {
      title: "Orbizza - Startup Page",
      url: "https://orbizza.com/",
      icon: <BriefcaseBusiness className='h-5 w-5' />,
    },
    {
      title: "Check out my Github",
      url: "https://github.com/deepshaswat",
      icon: <Github className='h-5 w-5' />,
    },

    {
      title: "Visit my Portfolio",
      url: "https://deepshaswat.com",
      icon: <ExternalLink className='h-5 w-5' />,
    },
    {
      title: "Send me an email",
      url: "/contact",
      icon: <Mail className='h-5 w-5' />,
    },
  ];

  const socialIcons = [
    {
      icon: <Twitter className='h-6 w-6' />,
      url: "https://x.com/shaswat_X",
    },
    {
      icon: <LinkedinIcon className='h-6 w-6' />,
      url: "https://linkedin.com/in/deepshaswat",
    },
    {
      icon: <Send className='h-6 w-6' />,
      url: "https://t.me/+b50s4jgkW2kxN2Zl",
    },
    {
      icon: <Instagram className='h-6 w-6' />,
      url: "https://instagram.com/deepshaswat",
    },
    { icon: <Mail className='h-6 w-6' />, url: "/contact" },
  ];

  return (
    <div className='text-white min-h-screen'>
      <div className='max-w-6xl mx-auto px-4 py-16'>
        <div className='md:grid md:grid-cols-12 md:gap-8'>
          {/* Profile Section - Left Side */}
          <div className='md:col-span-4 flex flex-col items-center md:items-start space-y-4 mb-8 md:mb-0'>
            <Avatar className='h-24 w-24 mb-4'>
              <AvatarImage src='/static/images/headshot.svg' />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <h1 className='text-2xl font-bold text-center md:text-left'>
              Shaswat Deep
            </h1>

            <div className='text-sm'>
              <p className='pb-4 text-neutral-400 leading-relaxed tracking-wide'>
                <span className='text-neutral-200 font-bold'>
                  Hey, I&apos;m Shaswat Deep
                </span>{" "}
                I started as a software engineer back in 2013, working with
                automation testing.
              </p>
              <p className='pb-4 text-neutral-400 leading-relaxed tracking-wide'>
                Now as a{" "}
                <strong className='text-neutral-200'>Founder & CEO</strong> of
                Orbizza, I&apos;m building a platform to find and review{" "}
                <strong className='text-neutral-200'>Content Creators</strong>.
              </p>
              <p className='pb-4 text-neutral-400 leading-relaxed tracking-wide'>
                Outside of work, I love{" "}
                <strong className='text-neutral-200'>dark mode</strong>, the
                stock market, and ideating side projects. I like{" "}
                <strong className='text-neutral-200'>cooking</strong>, reading
                books, watching animes, and thinking about{" "}
                <strong className='text-neutral-200'>What If </strong>{" "}
                scenarios.
              </p>
            </div>

            {/* Social Icons */}
            <div className='flex space-x-4 mt-4'>
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white transition-colors duration-200'
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - Right Side */}
          <div className='md:mt-24 md:col-span-8'>
            <div className='space-y-4'>
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block transform transition-transform duration-200 hover:scale-105'
                >
                  <Button
                    variant='secondary'
                    className='w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12'
                  >
                    <div className='flex items-center justify-center space-x-2'>
                      {link.icon}
                      <span>{link.title}</span>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LinksComponent };
