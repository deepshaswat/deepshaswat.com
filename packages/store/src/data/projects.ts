export interface Project {
  name: string;
  description: string;
  url: string;
  stats?: string;
  icon?: string;
}

export interface FeaturedProject extends Project {
  stats: string;
  icon: string;
}

export interface ProjectsByYear {
  year: string;
  projects: Project[];
}

const featuredProjects: FeaturedProject[] = [
  {
    name: "StockBook",
    description: "Stock Market Research Platform",
    url: "https://stockbook.space",
    stats: "100+ STOCKS RESEARCHED",
    icon: "chart-candlestick",
  },
  {
    name: "Naviya.school",
    description: "Personalized AI Tutor for Students",
    url: "https://naviya.school",
    stats: "1000+ COURSES CREATED",
    icon: "graduation-cap",
  },
  {
    name: "VibeCreation",
    description: "Content Engine for Creators & Brands",
    url: "https://vibecreation.ai",
    stats: "100+ CONTENT CREATED",
    icon: "clapperboard",
  },
  // {
  //   name: "Ship.build",
  //   description: "AI DevOps for Everything after Code",
  //   url: "https://ship.build",
  //   stats: "100+ PROJECTS",
  //   icon: "sailboat",
  // },
  {
    name: "RateCreator",
    description: "Discover & Review Content Creators",
    url: "https://ratecreator.com",
    stats: "3M+ CREATORS ONBOARDED",
    icon: "star",
  },
];

const allProjects: ProjectsByYear[] = [
  {
    year: "2025 - Present",
    projects: [
      {
        name: "StockBook",
        description: "Stock Market Research Platform",
        url: "https://stockbook.space",
      },
      {
        name: "Naviya.school",
        description: "Personalized AI Tutor for Students",
        url: "https://naviya.school",
      },
      {
        name: "VibeCreation",
        description: "Content Engine for Creators & Brands",
        url: "https://vibecreation.ai",
      },
    ],
  },
  {
    year: "2024",
    projects: [
      {
        name: "RateCreator",
        description: "Discover & Review Content Creators",
        url: "https://ratecreator.com",
      },
    ],
  },
  {
    year: "2023",
    projects: [
      {
        name: "Open Source CMS",
        description: "Open Source CMS for Blog and Newsletter",
        url: "https://github.com/deepshaswat/deepshaswat.com",
      },
      {
        name: "Portfolio - Deep Shaswat",
        description: "Personal Portfolio Website with Newsletter and Blog",
        url: "https://github.com/deepshaswat/deepshaswat.com",
      },
    ],
  },

  {
    year: "2019 - 2023",
    projects: [
      {
        name: "Harness.io",
        description: "Open Source Continuous Delivery Platform",
        url: "https://www.harness.io/open-source",
      },

      {
        name: "Harness.io",
        description: "Continuous Verification Platform",
        url: "https://www.harness.io/",
      },
    ],
  },

  {
    year: "2017 - 2018",
    projects: [
      {
        name: "Analytics Framework for AppDynamics",
        description:
          "Analytics Framework for Business Intelligence in AppDynamics",
        url: "https://appdynamics.com",
      },
      {
        name: "Automation Framework for AppDynamics",
        description: "E2E Testing Automation Framework for AppDynamics",
        url: "https://appdynamics.com",
      },
    ],
  },
  {
    year: "2016",
    projects: [
      {
        name: "RSA SecurID",
        description: "2FA Authentication Solution for Enterprise",
        url: "https://www.rsa.com/products/securid/",
      },
    ],
  },

  {
    year: "2014 - 2015",
    projects: [
      {
        name: "OWASP Analyser for Proliant Server",
        description: "OWASP Security Scanner for Proliant Server",
        url: "https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server",
      },
      {
        name: "HPE Proliant Server",
        description: "Server Hardware and Software",
        url: "https://www.hpe.com/in/en/hpe-proliant-compute.html",
      },
    ],
  },
  {
    year: "2013",
    projects: [
      {
        name: "Intralinks",
        description: "Sharepoint and Collaboration Platform",
        url: "https://www.intralinks.com/",
      },
    ],
  },
  {
    year: "2008",
    projects: [
      {
        name: "BlogSpot - Personal Blog",
        description: "Personal Blog for my hobbies and interests",
        url: "https://deepshaswat.blogspot.com/",
      },
    ],
  },
];

export { featuredProjects, allProjects };
