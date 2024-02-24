"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function CategoryItem({
  food,
}: {
  food: { category: string; imageUrl: string; description: string };
}) {
  const containerVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const titleVariants = {
    initial: {
      y: 50, // Start a bit lower
      opacity: 0,
    },
    visible: {
      y: 280,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -40, // Move above the image
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const imageVariants = {
    initial: {
      y: 65, // Start a bit lower
      opacity: 0,
    },
    visible: {
      y: -65,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: 0, // Move above the image
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const descriptionVariants = {
    initial: {
      y: 150, // Start a bit lower
      opacity: 0,
    },
    hover: {
      y: 25, // Align with the title's original position
      opacity: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="relative border-[1px] border-slate-200 cursor-pointer text-gray-400 transition-all duration-300 ease-in-out hover:bg-color-secondary-alt dark:bg-muted ">
      <motion.div
        initial="initial"
        animate="visible"
        whileHover="hover"
        variants={containerVariants}
        className="w-[280px] h-[480px] lg:w-[420px] lg:h-[620px] px-6 py-4 flex flex-col items-center justify-center hover:text-gray-50"
      >
        <motion.div
          variants={titleVariants}
          className="font-extrabold text-4xl text-center"
        >
          {food.category}
        </motion.div>
        <motion.div variants={imageVariants}>
          <Image
            src={food.imageUrl}
            alt={food.category}
            width="280"
            height="280"
            sizes="(max-width: 280px) 100vw, 280px"
            className="w-full h-auto"
          />
        </motion.div>
        <motion.p variants={descriptionVariants} className="text-center">
          {food.description}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default CategoryItem;
