"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import {
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiLink,
  FiTarget,
  FiTool,
  FiUpload,
} from "react-icons/fi";

import Image from "next/image";

const FeaturedCategories = () => {
  const [position, setPosition] = useState(0);

  const shiftLeft = () => {
    if (position > 0) {
      setPosition((pv) => pv - 1);
    }
  };

  const shiftRight = () => {
    if (position < features.length - 1) {
      setPosition((pv) => pv + 1);
    }
  };

  return (
    <section className="overflow-hidden bg-neutral-100 dark:bg-muted px-4 py-12">
      <div className="mx-auto p-8 ">
        <div className="mb-8 flex justify-between gap-4">
          <h2 className="text-4xl font-bold leading-[1.2] md:text-5xl">
            Top Categories{" "}
            <span className="text-neutral-400">Curated For You</span>
          </h2>
          <div className="flex gap-2">
            <button
              className="h-fit bg-black p-4 text-2xl text-white transition-colors hover:bg-neutral-700"
              onClick={shiftLeft}
            >
              <FiChevronLeft />
            </button>
            <button
              className="h-fit bg-black p-4 text-2xl text-white transition-colors hover:bg-neutral-700"
              onClick={shiftRight}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          {features.map((feat, index) => (
            <Feature {...feat} key={index} position={position} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

type FeatureProps = {
  position: number;
  index: number;
  category: string;
  description: string;
  imageUrl: string;
};

const Feature = ({
  position,
  index,
  category,
  description,
  imageUrl,
}: FeatureProps) => {
  const translateAmt =
    position >= index ? index * 100 : index * 100 - 100 * (index - position);

  return (
    <motion.div
      animate={{ x: `${-translateAmt}%` }}
      transition={{
        ease: "easeInOut",
        duration: 0.35,
      }}
      className={`relative grid grid-cols-2 gap-1 min-h-[358px] w-10/12 max-h-[358px] max-w-lg shrink-0 flex-col justify-between items-center overflow-hidden p-8 shadow-lg md:w-3/5 ${
        index % 2
          ? "bg-black text-white"
          : "bg-white dark:bg-gray-700 dark:text-white"
      }`}
    >
      <div className="w-full h-full flex relative p-2 overflow-hidden rounded-md inset-0">
        <Image
          src={imageUrl}
          alt={category}
          width="0"
          height="0"
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          className="flex items-center w-full h-auto overflow-hidden rounded-md"
        />
      </div>
      <div className="">
        <h3 className="mb-8 text-3xl font-bold">{category}</h3>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

export default FeaturedCategories;

const features = [
  {
    category: "Dinner",
    imageUrl:
      "https://images.unsplash.com/photo-1611765083444-a3ce30f1c885?q=80&w=3771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe deserunt ipsum rerum natus fugit ex minima voluptas ratione quaerat. Ea!",
  },
  {
    category: "Breakfast",
    imageUrl:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, vitae sed? Maxime!",
  },
  {
    category: "Italian Cuisine",
    imageUrl:
      "https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ab perspiciatis earum quibusdam laudantium non nihil nesciunt?",
  },
  {
    category: "American Cuisine",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?q=80&w=3319&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem explicabo nobis officia, nostrum eligendi accusamus unde ad cumque, magnam deleniti adipisci fugiat facere. Veniam?",
  },
  {
    category: "Japanese Cuisine",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1694630151389-2d98d36b0e3e?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
  },
];
