"use client";

import { useEffect, useState } from "react";
import { GradientText } from "./GradientText";
import { PostContainer, PostContent, PostMain } from "./Post";

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
      <PostContent className=''>
        <PostContainer>
          <GradientText startColor={primaryColor} endColor={secondaryColor}>
            {tagline ? tagline : title}
          </GradientText>

          {description && (
            <p
              dangerouslySetInnerHTML={{ __html: description || "" }}
              className='text-md mb-12 mt-12 font-thin text-neutral-300'
            />
          )}
          {children}
        </PostContainer>
      </PostContent>
    </PostMain>
  );
}
