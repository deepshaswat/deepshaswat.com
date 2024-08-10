"use client";

import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

//import { CustomSignIn } from "../../../../../packages/ui/src/components/ui/custom-sign-in";
import { CustomSignIn } from "@repo/ui";

export default function Page() {
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
      {/* </div> */}
      {/* <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'></div> */}
    </div>
  );
}
