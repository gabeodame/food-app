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
        />
        <div className="w-full max-w-1/2 h-full absolute flex flex-col gap-2 items-center justify-center transform">
          <div className="text-yellow-50 text-4xl flex flex-col uppercase mt-8">
            <span className="w-fit text-5xl p-2 bg-color-red">
              {text_highlight1}{" "}
            </span>
            <span>{text} </span>
            <span className="text-6xl font-bold self-end p-2 w-fit bg-color-secondary-alt">
              {text_highlight2}
            </span>
          </div>
          <button className="bg-color_primary w-fit py-2 px-4 text-xl text-gray-50 rounded-md pt-2">
            {btn_text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdOne;
