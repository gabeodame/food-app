import React from "react";
import AdOne from "./AdOne";
import Image from "next/image";
import AdTwo from "./AdTwo";
import AdThree from "./AdThree";

function AdList() {
  return (
    <div className="w-full grid gap- md:gap-[1px] md:grid-cols-2 lg:grid-cols-3 auto-rows-auto ">
      <AdOne
        bg_imageUrl="https://images.unsplash.com/photo-1549590143-d5855148a9d5?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        text="Your Passion for"
        text_highlight1="share"
        text_highlight2="Cooking"
        btn_text="Share"
      />
      <AdTwo
        bg_imageUrl="https://images.unsplash.com/photo-1507638940746-7b17d6b55b8f?q=80&w=1789&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Discover Flavors!"
        desc="Entice users with a tantalizing ad featuring mouthwatering dishes in a visually appealing layout."
      />
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
        <AdThree
          bg_imageUrl="https://images.unsplash.com/photo-1564758913551-7212727c4b08?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          text="Your Passion for"
          text_highlight1="share"
          text_highlight2="Cooking"
          btn_text="Share"
        />
      </div>
    </div>
  );
}

export default AdList;
