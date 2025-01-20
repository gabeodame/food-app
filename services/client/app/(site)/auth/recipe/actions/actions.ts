"use server";
import { buildClient } from "@/app/util/buildClient";
import { Ingredient } from "../types/types";
import { BadRequestError } from "@gogittix/common";
import { NextResponse } from "next/server";

export const AddNewIngredient = async (ingredient: Ingredient) => {
  try {
    const client = buildClient();
    const res = await client.post("/api/1/ingredient", ingredient);
    if (!res?.data) {
      throw new Error("Failed to add new ingredient");
    }

    return res.data;
  } catch (error: any) {
    console.error("Error adding new ingredient:", error);
    return {
      error: error.message,
    };
  }
};
export const SearchIngredient = async (search: string) => {
  try {
    const client = buildClient();
    const res = await client.get(`/api/1/ingredient/search?name=${search}`);
    if (!res?.data) {
      throw new Error("Failed to add new ingredient");
    }

    return res.data;
  } catch (error: any) {
    // console.error("Error fetching ingredient:", error);
    NextResponse.json({ error: error.message }, { status: 400 });
  }
};
