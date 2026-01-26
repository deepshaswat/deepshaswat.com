"use client";

import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { CustomSignIn } from "@repo/ui/custom-sign-in";

export default function Page(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="flex items-center justify-center mt-8">
        <ClerkLoaded>
          <CustomSignIn />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="animate-spin text-muted-foreground" />
        </ClerkLoading>
      </div>
    </div>
  );
}
