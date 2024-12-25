"use client";

import Script from "next/script";

const GA_TRACKING_ID = "G-9J0Q4NP5EW";

export const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          //@ts-ignore
          window.dataLayer = window.dataLayer || [];

          //@ts-ignore
          function gtag() {
            // @ts-ignore
            // eslint-disable-next-line
            dataLayer.push(arguments);
          }

          //@ts-ignore
          gtag("js", new Date());

          //@ts-ignore
          gtag("config", { GA_TRACKING_ID });
        }}
      />
    </>
  );
};
