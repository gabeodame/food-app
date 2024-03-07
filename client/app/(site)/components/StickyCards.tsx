"use client";

import { cn } from "@/lib/utils";
import { BuildingOffice2Icon, UserGroupIcon } from "@heroicons/react/20/solid";
import { useScroll, motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { ElementType, ReactElement, ReactNode, useRef } from "react";
import {
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiCopy,
  FiDatabase,
} from "react-icons/fi";

//main component
export const StickyCards = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <div ref={ref} className="relative">
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
    </>
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
        background: isOddCard ? "black" : "white",
        color: isOddCard ? "white" : "black",
      }}
      className={cn("sticky top-0 flex justify-center w-full origin-top")}
    >
      <div
        className={cn("max-w-[80%] flex ", {
          "flex-row-reverse": !isOddCard,
        })}
      >
        <div className="w-full flex">
          <Image
            alt={card.title}
            src={card.imageUrl ?? ""}
            width="0"
            height="0"
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
            className="w-full h-full overflow-hidden m-0 "
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center px-4">
          <card.Icon className="mb-4 w-16 h-16 lg:h-24 lg:w-24" />
          <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
            {card.title}
          </h3>
          <p className="mb-8 max-w-lg text-center text-sm md:text-base">
            {card.description}
          </p>
          <Link
            href={card.routeTo}
            className={`flex items-center gap-2 rounded px-6 py-4 text-base font-medium uppercase text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
              card.ctaClasses
            } ${
              isOddCard
                ? "shadow-[4px_4px_0px_white] hover:shadow-[8px_8px_0px_white]"
                : "shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black]"
            }`}
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
