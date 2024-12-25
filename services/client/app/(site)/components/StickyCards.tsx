"use client";

import { cn } from "@/lib/utils";
import { BuildingOffice2Icon, UserGroupIcon } from "@heroicons/react/20/solid";
import { useScroll, motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { ElementType, useRef } from "react";
import { FiArrowRight, FiAward, FiCopy } from "react-icons/fi";

// Main component
export const StickyCards = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto">
      {CARDS.map((c, idx) => (
        <Card
          key={c.id}
          card={c}
          scrollYProgress={scrollYProgress}
          position={idx + 1}
        />
      ))}
    </div>
  );
};

// Card component
type CardProps = {
  position: number;
  card: {
    title: string;
    description: string;
    routeTo: string;
    ctaClasses: string;
    imageUrl?: string;
    Icon: ElementType;
  };
  scrollYProgress: MotionValue<number>;
};

const Card = ({ position, card, scrollYProgress }: CardProps) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  const isOddCard = position % 2;

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: position === CARDS.length ? undefined : y,
      }}
      className={cn(
        "sticky top-0 w-full max-w-7xl mx-auto  flex justify-center",
        {
          "bg-black text-white": isOddCard,
          "bg-white text-black": !isOddCard,
        }
      )}
    >
      <div className="w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        <div className="w-full h-[320px] md:h-[400px] lg:h-[500px] relative">
          <Image
            alt={card.title}
            src={card.imageUrl ?? ""}
            fill
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center px-4">
          <card.Icon className="mb-4 w-12 h-12 lg:w-16 lg:h-16" />
          <h3 className="mb-4 text-center text-2xl lg:text-4xl font-semibold">
            {card.title}
          </h3>
          <p className="mb-6 text-center text-sm lg:text-lg max-w-lg">
            {card.description}
          </p>
          <Link
            href={card.routeTo}
            className={cn(
              `flex items-center mb-2 gap-2 px-4 py-2 text-sm lg:text-base font-medium rounded-md uppercase transition-all`,
              card.ctaClasses,
              {
                "shadow-white hover:shadow-[8px_8px_0px_white]": isOddCard,
                "shadow-black hover:shadow-[8px_8px_0px_black]": !isOddCard,
              }
            )}
          >
            <span>Learn more</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const CARD_HEIGHT = 500;

const CARDS = [
  {
    id: 1,
    Icon: UserGroupIcon,
    title: "Join Our Growing Community",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi illo officia atque iure voluptatibus necessitatibus odit cupiditate reprehenderit iusto quaerat!",
    ctaClasses: "bg-violet-300",
    routeTo: "#",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1683707120318-8fad3fca1f13?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    Icon: BuildingOffice2Icon,
    title: "Become a Vendor",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi illo officia atque iure voluptatibus necessitatibus odit cupiditate reprehenderit iusto quaerat!",
    ctaClasses: "bg-pink-300",
    routeTo: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    Icon: FiCopy,
    title: "Savor Flavors around the World",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi illo officia atque iure voluptatibus necessitatibus odit cupiditate reprehenderit iusto quaerat!",
    ctaClasses: "bg-red-300",
    routeTo: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=3936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    Icon: FiAward,
    title: "Bring Your Event to Life",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi illo officia atque iure voluptatibus necessitatibus odit cupiditate reprehenderit iusto quaerat!",
    ctaClasses: "bg-amber-300",
    routeTo: "#",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661369889067-c86c31362f83?q=80&w=4138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
