import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
// import { GoogleAnalytics } from "@repo/ui/web";
import {
  Appbar,
  Footer,
  generateSiteConfig,
  CSPostHogProvider,
} from "@repo/ui/web";
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
    <html lang='en'>
      <CSPostHogProvider>
        <body className={inter.className}>
          {/* <GoogleAnalytics /> */}
          <Providers>
            <Appbar />
            {/* bg-gradient-to-t from-red-50 via-slate-200 to-neutral-400
          dark:from-slate-700 from-10% dark:via-slate-950 via-30% dark:to-black
          to-90% */}
            <div className='min-h-[calc(100vh-12vh)] max-w-screen-lg lg:mx-auto '>
              {children}
              <Toaster />
            </div>
            <Footer />
          </Providers>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
