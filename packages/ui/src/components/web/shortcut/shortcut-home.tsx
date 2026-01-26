"use client";

import { useEffect, useState } from "react";
import { ShortcutButton } from "./shortcut-button";
import { Kbd } from "../../ui/kbd";

export const ShortcutHome = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isMac = /(Mac)/i.test(navigator.userAgent);
  //const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const isMobile =
    /iPhone|iPad|Android/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isMobile) {
    return <ShortcutButton>Tap to start →</ShortcutButton>;
  } else if (isMac) {
    return (
      <ShortcutButton>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to start →
      </ShortcutButton>
    );
  } else {
    return (
      <ShortcutButton>
        Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to start →
      </ShortcutButton>
    );
  }
};
