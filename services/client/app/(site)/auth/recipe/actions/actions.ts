"use server";
import { buildClient } from "@/app/util/buildClient";
import { Ingredient } from "../types/types";

export const AddNewIngredient = async (ingredient: Ingredient) => {
  try {
    const client = buildClient();
    const res = await client.post("/api/1/ingredient", ingredient);
    if (!res?.data) {
      console.error("Failed to add new ingredient");
    }

    return res.data;
  } catch (error: any) {
    console.error("Error adding new ingredient:", error);
    return {
      error: error.message,
    };
  }
};
