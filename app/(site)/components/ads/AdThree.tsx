import Image from "next/image";
import React from "react";

type AdProp = {
  bg_imageUrl: string;
  text_highlight1: string;
  text_highlight2: string;
  text: string;
  btn_text: string;
};

function AdThree({
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
        <div className="w-full h-full absolute flex flex-col items-center justify-center overflow-hidden">
          <div className="w-1/2 flex transform translate-y-[100%]">
            <div className="h-full w-full text-yellow-50 text-4xl flex flex-col uppercase">
              <span className="w-fit text-4xl p-2 bg-color-green">
                {text_highlight1}
              </span>
              <span className="text-5xl font-bold p-2 w-fit bg-color-red">
                {text_highlight2}
              </span>
              <button className="bg-white w-fit py-2 px-4 text-xl text-gray-600 rounded-md pt-2">
                {btn_text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdThree;
