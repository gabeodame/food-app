import { buildClient } from "@/app/util/buildClient";
import { Recipe } from "../create-dish/types/types";
import { BadRequestError } from "@gogittix/common";
import { DishListTypes } from "../../models/types/types";
import dynamic from "next/dynamic";

export async function getUserRecipes(): Promise<DishListTypes[]> {
  const client = buildClient();
  try {
    const response = await client.get(
      `/api/1/recipes/search?currentUserId=currentUserId`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new BadRequestError("Failed to fetch user recipes");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    // return { error: error.message };
    return [];
  }
}
