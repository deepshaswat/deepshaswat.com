import "@repo/ui/styles.css";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@repo/ui";
import { Providers } from "./providers";

const inter = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Admin",
  description: "Admin interface for the blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-background text-foreground`}>
          <Providers>{children}</Providers>
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
