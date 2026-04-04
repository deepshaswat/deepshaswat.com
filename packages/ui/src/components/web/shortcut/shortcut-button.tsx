"use client";

import { useKBar } from "kbar";
import { Button } from "../../ui/button";

interface ShortcutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function ShortcutButton({ children, className }: ShortcutButtonProps) {
  const { query } = useKBar();

  return (
    <Button className={className} onClick={query.toggle} variant="ghost">
      <div className="grid grid-flow-col gap-1 mx-[0] text-lg">{children}</div>
    </Button>
  );
}
