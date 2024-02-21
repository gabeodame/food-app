"use client";

import React from "react";
import Link from "next/link";
import Lottie from "react-lottie";
import * as logoAnimationData from "../lib/lottieFiles/animations/food_animation.json";

function Logo() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: logoAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-fit">
      <Link
        href="/"
        className="NavigationMenuLink flex items-center justify-center w-full h-full"
      >
        <Lottie
          options={defaultOptions}
          height={80}
          width={80}
          style={{
            paddingBottom: "20px",
          }}
        />
        <div className="hidden font-black text-3xl h-full md:flex ">
          <span className="text-color-secondary-alt dark:text-muted-foreground">
            D
          </span>
          <span className="text-color_primary">ish</span>
          <span className="text-color-secondary-alt dark:text-muted-foreground">
            S
          </span>
          <span className="text-color_primary">hare</span>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
