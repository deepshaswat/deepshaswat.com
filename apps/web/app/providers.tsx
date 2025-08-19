"use client";

import React from "react";
import { ThemeProvider } from "@repo/ui";
import { CommandBar, CSPostHogProvider } from "@repo/ui/web";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
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
};
