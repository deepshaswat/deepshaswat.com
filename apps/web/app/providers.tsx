"use client";

import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "next-themes";
import posthogJs from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { CommandBar } from "@repo/ui/command";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (apiKey && apiHost && !posthogJs.__loaded) {
      posthogJs.init(apiKey, {
        api_host: apiHost,
        loaded: (client) => {
          if (process.env.NODE_ENV === "development") client.debug();
        },
        persistence: "localStorage+cookie",
        bootstrap: {
          distinctID: posthogJs.get_distinct_id(),
          isIdentifiedID: true,
        },
        autocapture: false,
      });
    }
  }, []);

  return (
    <RecoilRoot>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <PostHogProvider client={posthogJs}>
          <CommandBar>{children}</CommandBar>
        </PostHogProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
