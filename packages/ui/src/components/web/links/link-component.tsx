import React from "react";
import Image from "next/image";
import {
  Github,
  Twitter,
  Instagram,
  LinkedinIcon,
  ExternalLink,
  Mail,
  Send,
  Calendar,
  BriefcaseBusiness,
  Sailboat,
  Star,
  Clapperboard,
  GraduationCap,
  Handshake,
  CandlestickChart,
} from "lucide-react";
import { Button } from "../../ui/button";

interface LinkData {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

function LinksComponent() {
  const companyLinks: LinkData[] = [
    {
      title: "UseMoney AI - Copilot for Retail Investors",
      url: "https://usemoney.ai/",
      icon: <CandlestickChart className="h-5 w-5" />,
    },
    // {
    //   title: "DIS Digital LLP - Company Registered in India",
    //   url: "https://disdigital.in/",
    //   icon: <Handshake className='h-5 w-5' />,
    // },
  ];
  const links: LinkData[] = [
    {
      title: "Naviya - Personalized AI Tutor for Students",
      url: "https://naviya.school/",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Ship.build - AI DevOps for Everything after Code",
      url: "https://ship.build/",
      icon: <Sailboat className="h-5 w-5" />,
    },
    {
      title: "RateCreator - Discover & Review Content Creators",
      url: "https://ratecreator.com/",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "VibeCreation - Content Engine for Creators & Brands",
      url: "https://vibecreation.ai/",
      icon: <Clapperboard className="h-5 w-5" />,
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
      url: "https://www.deepshaswat.com",
      icon: <ExternalLink className="h-5 w-5" />,
    },
  ];

  const socialIcons = [
    {
      icon: <Twitter className="h-6 w-6" />,
      url: "https://x.com/deepshaswat",
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

  return (
    <div className="text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="md:grid md:grid-cols-12 md:gap-8">
          {/* Profile Section - Left Side */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-4 mb-8 md:mb-0">
            <div className="flex flex-col items-center justify-center md:items-start">
              <Image
                alt="Shaswat Deep"
                className="rounded-full md:rounded-lg mb-4 items-center justify-center md:w-full"
                height={156}
                src="/static/images/headShot.png"
                width={156}
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
                I&apos;m the{" "}
                <strong className="text-neutral-200">Founder,</strong> at{" "}
                <strong className="text-neutral-200">UseMoney AI.</strong>{" "}
                Before that, I was a{" "}
                <strong className="text-neutral-200">
                  Senior Staff Software Engineer
                </strong>{" "}
                at <strong className="text-neutral-200">Harness.io</strong> and{" "}
                <strong className="text-neutral-200">AppDynamics</strong>, a
                Cisco company.
              </p>
              <p className="pb-4 text-neutral-400 leading-relaxed tracking-wide">
                Outside of work, I love{" "}
                <strong className="text-neutral-200">dark mode</strong>, the
                stock market, and ideating side projects. I like{" "}
                <strong className="text-neutral-200">cooking</strong>, reading
                books, watching animes, and thinking about{" "}
                <strong className="text-neutral-200">What If</strong> scenarios.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {socialIcons.map((social, index) => (
                <a
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  href={social.url}
                  key={index}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - Right Side */}
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold text-center md:text-left mb-4 mt-8">
              Currently Building
            </h2>
            <div className="space-y-4 mb-4">
              {companyLinks.map((link, index) => (
                <a
                  className="block transform transition-transform duration-200 hover:scale-105"
                  href={link.url}
                  key={index}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                    variant="secondary"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {link.icon}
                      <span>{link.title}</span>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-center md:text-left mb-4">
              Ideas & Products
            </h2>
            <div className="space-y-4">
              {links.map((link, index) => (
                <a
                  className="block transform transition-transform duration-200 hover:scale-105"
                  href={link.url}
                  key={index}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                    variant="secondary"
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
              Contact Me
            </h2>
            <div className="space-y-4">
              {contactLinks.map((link, index) => (
                <a
                  className="block transform transition-transform duration-200 hover:scale-105"
                  href={link.url}
                  key={index}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                    variant="secondary"
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
          <div className="md:col-span-8" />
        </div>
      </div>
    </div>
  );
}

export { LinksComponent };
