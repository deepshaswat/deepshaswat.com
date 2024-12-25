"use client";

import { GradientText } from "./GradientText";
import { PostContainer, PostContent, PostMain } from "./Post";

interface BaseProps {
  title: string;
  tagline: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  children: React.ReactNode;
}

const Base: React.FC<BaseProps> = ({
  title,
  description,
  tagline,
  primaryColor,
  secondaryColor,
  children,
}) => {
  return (
    <>
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
            <GradientText startColor={primaryColor} endColor={secondaryColor}>
              {tagline ? tagline : title}
            </GradientText>

            <p
              dangerouslySetInnerHTML={{ __html: description || "" }}
              className="text-md mb-12 mt-12 font-thin text-decoration"
            />
            {children}
          </PostContainer>
        </PostContent>
      </PostMain>
    </>
  );
};

export { Base };
