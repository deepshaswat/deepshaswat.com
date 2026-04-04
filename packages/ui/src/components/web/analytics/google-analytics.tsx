"use client";

import Script from "next/script";

const GA_TRACKING_ID = "G-9J0Q4NP5EW";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  return (
    <Script
      onLoad={() => {
        window.dataLayer = window.dataLayer ?? [];

        function gtag(...args: unknown[]) {
          window.dataLayer?.push(args);
        }

        window.gtag = gtag;

        gtag("js", new Date());
        gtag("config", GA_TRACKING_ID);
      }}
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      strategy="afterInteractive"
    />
  );
}
