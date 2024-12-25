"use client";

import React from "react";
import { ThemeProvider } from "@repo/ui";
import { CommandBar } from "@repo/ui/web";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <RecoilRoot>
        <CommandBar>{children}</CommandBar>
      </RecoilRoot>
    </ThemeProvider>
  );
};
