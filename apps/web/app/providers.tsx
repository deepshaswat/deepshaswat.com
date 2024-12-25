"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@repo/ui";
import { CommandBar, CSPostHogProvider } from "@repo/ui/web";
import { RecoilRoot } from "recoil";

function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CommandBar>{children}</CommandBar>
    </ThemeProvider>
  );
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CSPostHogProvider>
      <RecoilRoot>
        <ClientProviders>{children}</ClientProviders>
      </RecoilRoot>
    </CSPostHogProvider>
  );
};
