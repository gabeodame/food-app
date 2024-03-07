import { barlowCondensed } from "@/app/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type AdProp = {
  title: string;
  desc: string;
  bg_imageUrl: string;
  fg_imageUrl?: string;
};

function AdTwo({ title, desc, bg_imageUrl, fg_imageUrl }: AdProp) {
  return (
    <div className="w-full h-[520px] bg-green-200">
      <div className="w-full h-full relative">
        <Image
          src={bg_imageUrl}
          fill
          alt="background image of couple cooking"
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="full h-full absolute flex flex-col gap-2 items-center justify-center ">
          <div
            className={cn(`w-3/4 text-yellow-50 text-4xl flex flex-col  mt-8 `)}
          >
            <span
              className={`w-fit text-6xl font-extrabold p-2 text-white uppercase ${barlowCondensed.className} `}
            >
              {title}
            </span>
            <div className="h-full text-white text-md relative">
              <div className="z-10 text-sm p-2 bg-gray-800 rounded-md shadow-md">
                {desc}
              </div>
            </div>
          </div>
          <button className="bg-color_primary w-fit py-2 px-4 text-lg text-gray-50 rounded-md pt-2">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdTwo;
