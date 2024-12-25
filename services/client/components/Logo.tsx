"use client";

import React from "react";
import Link from "next/link";
import Lottie from "react-lottie";
import LogoText from "./LogoText";

function Logo() {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: logoAnimationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };
  return (
    <div className="w-fit">
      <Link
        href="/"
        className="NavigationMenuLink flex items-center justify-center w-full h-full"
      >
        {/* Show full text on md+ screens, badge on small screens */}
        <div className="hidden md:block">
          <LogoText />
        </div>
        <div className="block md:hidden">
          <LogoBadge />
        </div>
      </Link>
    </div>
  );
}

export default Logo;

function LogoBadge() {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-color-secondary-alt text-white font-bold rounded-full dark:bg-muted-foreground">
      DS
    </div>
  );
}
