// components/PostMain.tsx
import { cn } from "@repo/ui/utils";
import React from "react";

interface PostMainProps {
  children: React.ReactNode;
}

const PostMain: React.FC<PostMainProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-hidden  mx-auto min-h-[calc(100vh-21.5vh)] flex flex-col max-w-screen-sm md:max-w-screen-md ">
      {children}
    </main>
  );
};

interface PostProps {
  children: React.ReactNode;
}

const Post: React.FC<PostProps> = ({ children }) => {
  return <main className="flex-1 overflow-hidden">{children}</main>;
};

interface PostContainerProps {
  children: React.ReactNode;
}

const PostContainer: React.FC<PostContainerProps> = ({ children }) => {
  return <div className="mx-auto max-w-760px p-5">{children}</div>;
};

interface PostContentProps {
  children: React.ReactNode;
  className?: string;
}

const PostContent: React.FC<PostContentProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative z-1 h-full p-5 bg-background text-secondary text-lg leading-8",
        className,
      )}
    >
      {children}
      {/* Inline styles for iframe-wrap, post-image-caption, and other specific elements can be applied directly in their respective components or using global CSS with Tailwind's apply feature if they are reused extensively */}
    </div>
  );
};

export { Post, PostMain, PostContainer, PostContent };
