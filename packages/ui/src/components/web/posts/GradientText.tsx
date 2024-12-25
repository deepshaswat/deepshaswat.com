import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  startColor: string;
  endColor: string;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  startColor,
  endColor,
  className,
}) => {
  const style = {
    backgroundImage: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    userSelect: "none", // Disables text selection
    WebkitUserSelect: "none", // Disables text selection for WebKit browsers
    MozUserSelect: "none", // Disables text selection for Firefox
    msUserSelect: "none", // Disables text selection for IE10+
  } as React.CSSProperties;

  return (
    <>
      <h1
        className={`gradient-text text-5xl font-bold mb-10 ${className}`}
        style={style}
      >
        {children}
      </h1>
    </>
  );
};

export { GradientText };
