import Image from "next/image";
import React from "react";

type AdProp = {
  bg_imageUrl: string;
  text_highlight1: string;
  text_highlight2: string;
  text: string;
  btn_text: string;
};

function AdOne({
  bg_imageUrl,
  text,
  text_highlight1,
  text_highlight2,
  btn_text,
}: AdProp) {
  return (
    <div className="w-full flex h-[320px] sm:h-[400px] lg:h-[520px] relative">
      <Image
        src={bg_imageUrl}
        fill
        alt="background image"
        sizes="100vw"
        objectFit="cover"
        className="rounded-md"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <div className="text-yellow-50 text-4xl flex flex-col uppercase">
          <span className="w-fit p-2 bg-color-red">{text_highlight1}</span>
          <span>{text}</span>
          <span className="text-5xl font-bold p-2 w-fit bg-color-secondary-alt">
            {text_highlight2}
          </span>
        </div>
        <button className="bg-color_primary w-fit py-2 px-4 text-lg text-white rounded-md">
          {btn_text}
        </button>
      </div>
    </div>
  );
}

export default AdOne;
