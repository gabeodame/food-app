import { cn } from "@/lib/utils";
import React from "react";

function Container({
  width,
  children,
  ...rest
}: {
  width?: "small" | "medium" | "large" | "extra-large" | "full";
  children: React.ReactNode;
}) {
  return (
    <div
      {...rest}
      className={cn(
        "w-full flex flex-col h-full justify-center mx-auto px-4 sm:px-6 md:px-8", // Adjust padding based on screen size
        {
          "xl:max-w-8xl": width === "extra-large", // These will apply based on the width prop
          "lg:max-w-7xl": width === "large",
          "md:max-w-5xl": width === "medium",
          "sm:max-w-3xl": width === "small",
          "max-w-full": !width, // Full width for mobile by default
        }
      )}
    >
      {children}
    </div>
  );
}

export default Container;
