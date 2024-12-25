import { useKBar } from "kbar";
import { Button } from "@repo/ui";

interface ShortcutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const ShortcutButton = ({
  children,
  className,
}: ShortcutButtonProps) => {
  const { query } = useKBar();

  return (
    <Button variant={"ghost"} onClick={query.toggle} className={className}>
      <div className="grid grid-flow-col gap-1 mx-[0] text-lg">{children}</div>
    </Button>
  );
};
