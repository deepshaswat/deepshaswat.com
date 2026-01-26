"use client";

import React from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider, TooltipProvider } from "@repo/ui";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <RecoilRoot>
        <TooltipProvider>{children}</TooltipProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}
