import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "@repo/ui/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import {
  Appbar,
  Footer,
  generateSiteConfig,
  NewsletterButton,
} from "@repo/ui/web";
import { Toaster } from "@repo/ui";

const inter = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "black",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  ...generateSiteConfig("Shaswat Deep", "deepshaswat.com", "/"),
  icons: {
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={`${inter.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          <main className='flex min-h-screen flex-col'>
            <Appbar />
            <div className='flex-1 w-full max-w-screen-lg mx-auto px-4'>
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
