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

const Base: React.FC<BaseProps> = (props) => {
  return <BaseClient {...props} />;
};

export { Base };
