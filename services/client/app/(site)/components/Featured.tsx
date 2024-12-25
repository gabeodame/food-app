"use client";
import { barlowCondensed, oswald } from "@/app/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./Featured.css";
import FuzzyOverlay from "@/components/ui/FuzzyOverlay";

function Featured() {
  const container = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const imageInView = useInView(imageRef, { once: true, amount: 0.5 }); //
  const titleInView = useInView(imageRef, { once: false, amount: 0.5 }); //
  const ImageVariants = {
    initial: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: imageInView ? 1 : 0,
      x: imageInView ? "-30%" : -50,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    whileHover: {
      saturate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };
  const titleVariants = {
    initial: {
      x: "-100%", // Start a bit lower
      opacity: titleInView ? 1 : 0,
    },
    visible: {
      x: titleInView ? 0 : -50,
      opacity: titleInView ? 1 : 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.5 },
    },
  };

  return (
    <div className="h-[540px] w-full flex bg-color-secondary-alt items-center justify-center overflow-hidden  relative">
      <motion.div
        ref={imageRef}
        initial="initial"
        animate="visible"
        variants={ImageVariants}
        className="flex absolute left-0 h-full w-full overflow-hidden object-cover"
      >
        <Image
          src="https://images.unsplash.com/photo-1542002976-c3be9b105508?q=80&w=3638&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="recipe book"
          width="0"
          height="0"
          sizes="100%"
          className="w-svw h-[540px] rounded-lg overflow-hidden opacity-45 md:opacity-100 relative object-contain"
        />
        <div className="z-6 absolute w-full h-full bg-gradient-to-r from-transparent from-50% via-color-secondary-alt via-75% to-color-secondary-alt"></div>
      </motion.div>
      <div className="z-5 absolute w-full h-full  polygon-r bg-color-green background_image"></div>
      <div className="z-5 absolute w-full h-full  polygon-l bg-color-green background_image"></div>
      <motion.div
        ref={titleRef}
        initial="initial"
        animate="visible"
        variants={titleVariants}
        className="h-full w-full absolute flex items-center justify-center flex-grow transform"
      >
        <div className="flex w-full h-full flex-col items-center justify-center">
          <div className="w-[60%] flex flex-col items-center justify-center translate-x-32">
            <h1
              className={cn(
                "font-bold h-full w-full flex items-center justify-center text-8xl text-center text-slate-50",
                barlowCondensed.className
              )}
            >
              A World of Culinary Creations
            </h1>
            <div className=" text-gray-100  ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae et
              repellendus magnam voluptatum alias, tempore voluptatibus
              molestias ab voluptas saepe cumque fugit harum. Inventore delectus
              cumque magnam nostrum natus quas perspiciatis explicabo, quasi
              voluptatibus illum, possimus omnis totam praesentium minima nam
              ducimus ex quisquam esse tempore eos ipsa saepe. Quam.
            </div>
          </div>
        </div>
      </motion.div>
      <FuzzyOverlay />
    </div>
  );
}

export default Featured;
