"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useNavigationGuard(hasUnsavedChanges: () => boolean) {
  const [showDialog, setShowDialog] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const router = useRouter();

  const requestNavigation = (url: string) => {
    if (hasUnsavedChanges()) {
      setTargetPath(url);
      setShowDialog(true);
    } else {
      router.push(url);
    }
  };

  const confirmNavigation = (action: "discard" | "save") => {
    setShowDialog(false);
    if (action === "discard") {
      // Reset state if needed
      if (targetPath) router.push(targetPath);
    } else if (action === "save") {
      // Implement save logic here, then navigate
      if (targetPath) router.push(targetPath);
    }
    setTargetPath(null);
  };

  return {
    showDialog,
    setShowDialog,
    requestNavigation,
    confirmNavigation,
  };
}
