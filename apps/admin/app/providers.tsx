"use client";

import React from "react";

import { ThemeProvider, TooltipProvider } from "@repo/ui";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
    >
      <RecoilRoot>
        <TooltipProvider>{children}</TooltipProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};
