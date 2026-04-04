"use client";

import { useKBar } from "kbar";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Button } from "../../ui/button";
import { Navigation } from "./navigation";

export function Appbar() {
  const { query } = useKBar();
  const posthog = usePostHog();

  const onClick = () => {
    posthog.capture("logo_clicked");
  };

  return (
    <header className=" px-4 py-2 ">
      <div className="max-w-screen-4xl mx-auto">
        <div className="w-full flex items-center justify-between ">
          <Link href="/" passHref>
            <Button
              className="font-bold text-3xl no-underline font-heading"
              onClick={onClick}
              variant="ghost"
            >
              S
            </Button>
          </Link>
          <div className="flex items-center md:gap-x-12 lg:gap-x-16">
            <Navigation />
          </div>
          <Button
            onClick={() => {
              query.toggle();
            }}
            variant="ghost"
          >
            <Menu size={32} />
          </Button>
        </div>
      </div>
    </header>
  );
}
