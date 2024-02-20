"use client";
import { cn } from "@/lib/utils";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

function FavoriteHeart({ onFavorited }: { onFavorited: () => void }) {
  const [isFavorited, setFavorited] = useState(false);
  return (
    <HeartFilledIcon
      className={cn(
        "h-6 w-6 text-color-secondary-alt cursor-pointer hover:scale-105 transition-transform duration-150 ease-in-out",
        {
          "text-color-red": isFavorited,
        }
      )}
      onClick={() => setFavorited(!isFavorited)}
    />
  );
}

export default FavoriteHeart;
