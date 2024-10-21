import React from "react";
import Image from "next/image";
import { ListItem } from "./TopNavBar";
import { getImage } from "@/app/util/helperfunctions";

interface CategoryProp {
  title: string;
  href: string;
  imageUrl: string;
  description: string;
}

function CategoryMenu({ category }: { category: CategoryProp }) {
  //   const imageDataUrl = await getImage(category.imageUrl);
  return (
    <ListItem
      key={category.title}
      // title={category.title}
      href={category.href}
    >
      <div className="flex gap-2  items-center justify-center">
        <div className="w-full h-full rounded-sm shadow-sm overflow-hidden">
          <Image
            src={category.imageUrl}
            alt={category.title}
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-full overflow-hidden m-0"
            // placeholder="blur"
            // blurDataURL={imageDataUrl}
            priority
          />
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <span className="font-bold text-primary">{category.title}</span>
          <span>{category.description}</span>
        </div>
      </div>
    </ListItem>
  );
}

export default CategoryMenu;
