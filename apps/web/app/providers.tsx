"use client";

import React from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@repo/ui";
import { CommandBar, CSPostHogProvider } from "@repo/ui/web";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <CSPostHogProvider>
      <RecoilRoot>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <CommandBar>{children}</CommandBar>
        </ThemeProvider>
      </RecoilRoot>
    </CSPostHogProvider>
  );
}
