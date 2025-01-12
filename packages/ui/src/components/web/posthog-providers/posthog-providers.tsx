"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  // checks that we are client-side
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (apiKey && apiHost) {
    posthog.init(apiKey, {
      api_host: apiHost,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
      persistence: "localStorage+cookie",
      bootstrap: {
        distinctID: posthog.get_distinct_id(),
        isIdentifiedID: true,
      },
      autocapture: false, // Disable autocapture to reduce noise
    });
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
