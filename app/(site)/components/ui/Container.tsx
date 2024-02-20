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
        "w-full flex flex-col h-full justify-center mx-auto px-8"
        // {
        //   "xl:max-w-8xl": width === "extra-large",
        //   "lg:max-w-7xl": width === "large",
        //   "md:max-w-5xl": width === "medium",
        //   "sm:max-w-3xl": width === "small",
        // }
      )}
    >
      {children}
    </div>
  );
}

export default Container;
