"use client";

import { NavButton } from "@/components/navbar/nav-button";

const routes = [
  {
    href: "/about",
  },
  {
    href: "/articles",
  },
  {
    href: "/investing",
  },
  {
    href: "/library",
  },
  {
    href: "/uses",
  },
  {
    href: "/newsletter",
  },
  {
    href: "/reminder",
  },
];

export const Navigation = () => {
  return (
    <nav className='hidden md:flex items-center gap-x-2 overflow-x-auto'>
      {routes.map((route) => (
        <NavButton key={route.href} href={route.href} path={route.href} />
      ))}
    </nav>
  );
};
