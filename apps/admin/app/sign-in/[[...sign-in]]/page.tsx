"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

function SignInContent(): JSX.Element {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  return <SignIn fallbackRedirectUrl={redirectUrl} signUpUrl={undefined} />;
}

export default function Page(): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        }
      >
        <SignInContent />
      </Suspense>
    </div>
  );
}
