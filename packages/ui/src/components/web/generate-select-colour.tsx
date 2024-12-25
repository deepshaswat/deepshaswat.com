// hooks/useDynamicSelectionStyle.ts
"use client";
import { useEffect } from "react";

type Color = "red" | "blue" | "green" | "yellow" | "black" | "white"; // Extend as needed

const useDynamicSelectionStyle = (textColor: Color, backgroundColor: Color) => {
  useEffect(() => {
    const className = `selection-text-${textColor}-bg-${backgroundColor}`;
    const style = document.createElement("style");
    style.textContent = `
            .${className}::selection {
                color: ${textColor};
                background-color: ${backgroundColor};
            }
            .${className}::-moz-selection {
                color: ${textColor};
                background-color: ${backgroundColor};
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [textColor, backgroundColor]);

  return `selection-text-${textColor}-bg-${backgroundColor}`;
};

export { useDynamicSelectionStyle };
