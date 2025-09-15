import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Appbar, Footer, NewsletterButton } from "@repo/ui/web";
import { Toaster } from "@repo/ui";

const inter = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "black",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export const metadataBase = new URL("https://deepshaswat.com");
export const metadata: Metadata = {
  title: "Shaswat Deep",
  description:
    "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder &amp; CEO of Orbizza, Inc.",
  keywords: [
    "Shaswat Deep",
    "software engineer",
    "entrepreneur",
    "writer",
    "Orbizza",
    "Technology",
    "Blogging",
    "Entrepreneurship",
    "Shaswat Deep",
    "Vibecreation",
    "Naviya",
    "RateCreator",
    "StockMarket",
    "Investing",
    "Crypto",
    "Web3",
    "AI",
    "MachineLearning",
    "DeepLearning",
    "DataScience",
    "Ship",
    "DevOps",
    "Cloud",
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Linear",
    "Resend",
  ],
  authors: [{ name: "Shaswat Deep", url: "https://deepshaswat.com" }],
  creator: "Shaswat Deep",
  publisher: "Shaswat Deep",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shaswat Deep",
    description:
      "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder &amp; CEO of Orbizza, Inc.",
    url: "https://deepshaswat.com",
    siteName: "Shaswat Deep",
    images: [
      {
        url: "/static/images/headShot.svg",
        width: 1200,
        height: 630,
        alt: "Shaswat Deep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaswat Deep",
    description:
      "Shaswat Deep is a software engineer, entrepreneur, and writer. He is the Founder &amp; CEO of Orbizza, Inc.",
    images: ["/static/images/headShot.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          <main className="flex min-h-screen flex-col">
            <Appbar />
            <div className="flex-1 w-full max-w-screen-lg mx-auto px-4">
              {children}
              <Toaster />
              <NewsletterButton />
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
