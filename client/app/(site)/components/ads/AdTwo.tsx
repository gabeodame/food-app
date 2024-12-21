import Image from "next/image";
import React from "react";

type AdProp = {
  title: string;
  desc: string;
  bg_imageUrl: string;
  fg_imageUrl?: string;
};

function AdTwo({ title, desc, bg_imageUrl }: AdProp) {
  return (
    <div className="w-full h-[320px] sm:h-[400px] lg:h-[520px] relative">
      <Image
        src={bg_imageUrl}
        fill
        alt="background image"
        sizes="100vw"
        objectFit="cover"
        className="opacity-90 rounded-md"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2 className="text-6xl font-extrabold text-white uppercase">
          {title}
        </h2>
        <p className="mt-4 p-2 bg-gray-800 text-sm text-white rounded-md shadow-md">
          {desc}
        </p>
        <button className="mt-4 bg-color_primary py-2 px-4 text-lg text-white rounded-md">
          Share
        </button>
      </div>
    </div>
  );
}

export default AdTwo;
