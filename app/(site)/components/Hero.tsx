import React from "react";
import Container from "./ui/Container";
import { cn } from "@/lib/utils";
import { josefinSlab, oswald } from "@/app/fonts";
import Image from "next/image";

function Hero() {
  return (
    <div className=" bg-green-100">
      <div className="relative w-full h=[540px]">
        <Image
          src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero image- jollof rice with chicken and shrimp"
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto rounded-r-lg overflow-hidden opacity-45 md:opacity-100"
        />
        <div className="flex md:flex-row flex-col justify-center items-center absolute top-[50%] right-0 transform -translate-y-1/2 ">
          <div className="flex flex-col gap-2  md:relative md:flex-1  ">
            <div className="w-[440px] max-w-[450px]  bg-gray-900 opacity-65 p-4 rounded-lg flex flex-col md:self-start">
              <h2
                className={cn(
                  "text-color_primary text-xl md:text-6xl text-center font-extrabold text-slate-50",
                  oswald.className
                )}
              >
                Discover a World of Culinary Creations: Where Tastes Unite!
              </h2>
              <p className="md:text-lg p-2 mx-2 text-center text-gray-50 bg-color_primary font-bold m-0 md:bg-color_primary md:rounded-sm">
                Savor the Flavor, Share the Passion: Explore, Connect, and Cook
                Together!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* </Container> */}
    </div>
  );
}

export default Hero;
