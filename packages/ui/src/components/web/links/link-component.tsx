import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage, Separator } from "@repo/ui";
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
  Sailboat,
  Star,
  Clapperboard,
  GraduationCap,
  Handshake,
  ChartCandlestick,
} from "lucide-react";

interface LinkData {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

const LinksComponent = () => {
  const companyLinks: LinkData[] = [
    {
      title: "Orbizza, Inc. - Company Registered in US",
      url: "https://orbizza.com/",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
    },
    {
      title: "DIS Digital LLP - Company Registered in India",
      url: "https://disdigital.in/",
      icon: <Handshake className="h-5 w-5" />,
    },
  ];
  const links: LinkData[] = [
    {
      title: "StockBook - Stock Market Research Platform",
      url: "https://stockbook.space/",
      icon: <ChartCandlestick className="h-5 w-5" />,
    },
    {
      title: "Naviya - Personalized AI Tutor for Students",
      url: "https://naviya.school/",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "VibeCreation - Content Engine Platform",
      url: "https://vibecreation.ai/",
      icon: <Clapperboard className="h-5 w-5" />,
    },
    {
      title: "Ship.build - AI DevOps Platform for Everything after Code",
      url: "https://ship.build/",
      icon: <Sailboat className="h-5 w-5" />,
    },
    {
      title: "RateCreator - Discover & Review Content Creators",
      url: "https://ratecreator.com/",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const contactLinks: LinkData[] = [
    {
      title: "Schedule a call with me",
      url: "https://topmate.io/deepshaswat/",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Check out my Github",
      url: "https://github.com/deepshaswat",
      icon: <Github className="h-5 w-5" />,
    },

    {
      title: "Send me an email",
      url: "/contact",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Visit my Portfolio",
      url: "https://deepshaswat.com",
      icon: <ExternalLink className="h-5 w-5" />,
    },
  ];

  const socialIcons = [
    {
      icon: <Twitter className="h-6 w-6" />,
      url: "https://x.com/shaswat_X",
    },
    {
      icon: <LinkedinIcon className="h-6 w-6" />,
      url: "https://linkedin.com/in/deepshaswat",
    },
    {
      icon: <Send className="h-6 w-6" />,
      url: "https://t.me/+b50s4jgkW2kxN2Zl",
    },
    {
      icon: <Instagram className="h-6 w-6" />,
      url: "https://instagram.com/deepshaswat",
    },
    { icon: <Mail className="h-6 w-6" />, url: "/contact" },
    {
      icon: <Calendar className="h-6 w-6" />,
      url: "https://topmate.io/deepshaswat/",
    },
  ];

  //  {
  //       title: "Schedule a call with me",
  //       url: "https://topmate.io/deepshaswat/",
  //       icon: <Calendar className='h-5 w-5' />,
  //     },

  return (
    <div className="text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="md:grid md:grid-cols-12 md:gap-8">
          {/* Profile Section - Left Side */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-4 mb-8 md:mb-0">
            {/* <Avatar className='h-24 w-24 mb-4'>
              <AvatarImage src='/static/images/headShot.png' />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar> */}
            <div className="flex flex-col items-center justify-center md:items-start">
              <Image
                alt="Shaswat Deep"
                src="/static/images/headShot.png"
                width={156}
                height={156}
                className="rounded-full md:rounded-lg mb-4 items-center justify-center md:w-full"
              />
              <h1 className="text-2xl font-bold text-center md:text-left">
                Shaswat Deep
              </h1>
            </div>

            <div className="text-sm">
              <p className="pb-4 text-neutral-400 leading-relaxed tracking-wide">
                <span className="text-neutral-200 font-bold">
                  Hey, I&apos;m Shaswat Deep
                </span>{" "}
                I started as a software engineer back in 2013, working as an{" "}
                <strong className="text-neutral-200">
                  Automation Engineer.
                </strong>{" "}
              </p>
              <p className="pb-4 text-neutral-400 leading-relaxed tracking-wide">
                Now as a{" "}
                <strong className="text-neutral-200">Solo-Founder,</strong>{" "}
                I&apos;m building products for{" "}
                <strong className="text-neutral-200">Creator Economy</strong> as
                part of Orbizza, Inc. called{" "}
                <strong className="text-neutral-200">
                  RateCreator &amp; VibeCreation.
                </strong>
              </p>
              <p className="pb-4 text-neutral-400 leading-relaxed tracking-wide">
                I&apos;m also tinkering with two side projects:{" "}
                <strong className="text-neutral-200">
                  Naviya - A personalized AI Tutor
                </strong>{" "}
                for students and{" "}
                <strong className="text-neutral-200">
                  Ship - AI Native DevOps Engineer
                </strong>{" "}
                for developers.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - Right Side */}
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold text-center md:text-left mb-4">
              Individual Startups
            </h2>
            <div className="space-y-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform transition-transform duration-200 hover:scale-105"
                >
                  <Button
                    variant="secondary"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {link.icon}
                      <span>{link.title}</span>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
            {/* <Separator className='my-4 bg-gray-700' /> */}
            <h2 className="text-2xl font-bold text-center md:text-left mb-4 mt-8">
              Registered Companies
            </h2>
            <div className="space-y-4">
              {companyLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform transition-transform duration-200 hover:scale-105"
                >
                  <Button
                    variant="secondary"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {link.icon}
                      <span>{link.title}</span>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-center md:text-left mb-4 mt-8">
              Contact Me
            </h2>
            <div className="space-y-4">
              {contactLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform transition-transform duration-200 hover:scale-105"
                >
                  <Button
                    variant="secondary"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {link.icon}
                      <span>{link.title}</span>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-8"></div>
        </div>
      </div>
    </div>
  );
};

export { LinksComponent };
