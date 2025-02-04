"use client";
import { cn } from "@/lib/utils";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect, useCallback } from "react";
import { buildClient } from "@/app/util/buildClient";

type FavoriteHeartProps = {
  recipeId: number;
};

function FavoriteHeart({ recipeId }: FavoriteHeartProps) {
  const [isFavorited, setFavorited] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const client = buildClient();

  // ✅ Fetch Favorite Status
  const fetchFavoriteStatus = useCallback(async () => {
    try {
      const res = await client.get(`/api/1/recipes/${recipeId}/favorite`);
      console.log(
        "Fetched Favorite status:",
        res.data.isFavoritedByCurrentUser
      );
      setFavorited(res.data.isFavoritedByCurrentUser);
    } catch (error) {
      console.error("Failed to fetch favorite status:", error);
    }
  }, [recipeId, client]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  console.log("isFavorited:", isFavorited);

  if (isFavorited === null) return null; // ✅ Prevent UI flicker before API loads

  // ✅ Correct Toggle Logic with Backend Sync
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const newStatus = !isFavorited;

    try {
      console.log("Toggling favorite status:", newStatus);

      // ✅ Update backend first, then update UI
      if (newStatus) {
        await client.post(`/api/1/recipes/${recipeId}/favorite`);
      } else {
        await client.delete(`/api/1/recipes/${recipeId}/favorite`);
      }

      setFavorited(newStatus); // ✅ UI syncs with backend
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeartFilledIcon
        className={cn(
          "h-6 w-6 cursor-pointer hover:scale-105 transition-transform duration-150 ease-in-out",
          {
            "text-color-secondary-alt": !isFavorited,
            "text-red-500": isFavorited,
            "opacity-50 cursor-not-allowed": loading,
          }
        )}
        onClick={handleFavoriteToggle}
      />
    </div>
  );
}

export default FavoriteHeart;
