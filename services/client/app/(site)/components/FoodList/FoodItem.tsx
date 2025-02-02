"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FavoriteHeart from "@/components/widgets/FavoriteHeart";
import { useRouter } from "next/navigation";
import { FoodItemProps, FoodListTypes } from "../../models/types/types";

function FoodItem({ item }: { item: FoodListTypes }) {
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
      <div className="w-full h-auto bg-white dark:bg-gray-700 flex flex-col items-end gap-2 md:gap-4 rounded-xl shadow-lg p-4 md:p-6 overflow-hidden cursor-pointer relative">
        <motion.div
          initial="initial"
          animate="visible"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3, ease: "backInOut" },
          }}
          className="w-full flex flex-col gap-2 md:gap-3"
        >
          {/* Image Container */}
          <div className="w-full relative pb-[56.25%] overflow-hidden rounded-md">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover absolute inset-0 w-full h-full rounded-md"
            />
          </div>

          {/* Content Section */}
          <div className="w-full flex flex-col gap-1 md:gap-2 items-center justify-center z-10 relative">
            <h1 className="w-full font-bold text-base md:text-lg text-gray-900 uppercase flex justify-between items-center">
              <span className="dark:text-white">{item.title}</span>
              <FavoriteHeart onFavorited={handleFavorited} />
            </h1>
            <p className="line-clamp-4 text-xs md:text-sm text-gray-400 text-center">
              {item.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FoodItem;
