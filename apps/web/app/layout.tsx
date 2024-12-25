import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Appbar, Footer, generateSiteConfig } from "@repo/ui/web";
import { Toaster } from "@repo/ui";

const inter = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = generateSiteConfig(
  "Shaswat Deep",
  "deepshaswat.com",
  "/"
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <main className='flex min-h-screen flex-col'>
            <Appbar />
            <div className='flex-1 w-full max-w-screen-lg mx-auto px-4'>
              {children}
              <Toaster />
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
