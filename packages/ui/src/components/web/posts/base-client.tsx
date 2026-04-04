"use client";

import { useEffect, useState } from "react";
import { GradientText } from "./gradient-text";
import { PostContainer, PostContent, PostMain } from "./post";

interface BaseClientProps {
  title: string;
  tagline: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  children: React.ReactNode;
}

export function BaseClient({
  title,
  description,
  tagline,
  primaryColor,
  secondaryColor,
  children,
}: BaseClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PostMain>
      <style>{`
        ::selection {
         background: ${primaryColor};
         color: #000;
         webkittextfillcolor: "#000";
         webkitbackgroundclip: "text";
       }
     `}</style>
      <PostContent className="">
        <PostContainer>
          <GradientText endColor={secondaryColor} startColor={primaryColor}>
            {tagline ? tagline : title}
          </GradientText>

          {description ? (
            <p
              className="text-md mb-12 mt-12 font-thin text-neutral-300"
              dangerouslySetInnerHTML={{ __html: description || "" }}
            />
          ) : null}
          {children}
        </PostContainer>
      </PostContent>
    </PostMain>
  );
}
