"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FavoriteHeart from "@/components/widgets/FavoriteHeart";
import { useRouter } from "next/navigation";
import { FoodItemProps, FoodListTypes } from "../../models/types/types";

function FoodItem({ item }: { item: FoodListTypes }) {
  // console.log(item);
  const router = useRouter();
  const imageVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const handleFavorited = () => {
    console.log(item.title);
  };

  const handleClicked = () => {
    router.push(`/foods/${item.id}`);
  };

  return (
    <div className="relative" onClick={handleClicked}>
      <div className="w-full h-[550px] bg-white dark:bg-gray-700 flex flex-col items-end gap-4 rounded-xl shadow-lg p-6 overflow-hidden cursor-pointer relative ">
        <motion.div
          initial="initial"
          animate="visible"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3, ease: "backInOut" },
          }}
          className="w-full h-full flex flex-col gap-3"
        >
          <div className="w-full h-full relative p-2 overflow-hidden rounded-md inset-0">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto overflow-hidden rounded-md"
            />
          </div>
          <div className="w-full flex flex-col gap-2 items-center justify-center  z-10 relative">
            <h1 className="w-full font-bold text-md text-gray-900 uppercase self-start flex justify-between items-center">
              <span className="dark:text-white">{item.title}</span>
              <FavoriteHeart onFavorited={handleFavorited} />
            </h1>
            <p className="text-md text-gray-400">{item.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FoodItem;
