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
        {/* <Lottie
          options={defaultOptions}
          height={80}
          width={80}
          style={{
            paddingBottom: "20px",
          }}
        /> */}
        <LogoText />
      </Link>
    </div>
  );
}

export default Logo;
