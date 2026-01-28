// Force all auth routes to be dynamic (not prerendered)
export const dynamic = "force-dynamic";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
