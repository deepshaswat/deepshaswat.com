// Server component wrapper
import { BaseClient } from "./base-client";

interface BaseProps {
  title: string;
  tagline: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  children: React.ReactNode;
}

export function Base({
  title,
  tagline,
  description,
  primaryColor,
  secondaryColor,
  children,
}: BaseProps) {
  return (
    <BaseClient
      title={title}
      tagline={tagline}
      description={description}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      {children}
    </BaseClient>
  );
}
