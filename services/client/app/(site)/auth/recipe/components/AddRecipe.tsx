"use client";

import React from "react";
import NewRecipeForm from "../forms/NewRecipeForm";
import NutritionalTracker from "./NutritionalTracker";

function AddRecipe() {
  return (
    <div className="w-full flex gap-4 ">
      <NewRecipeForm />
      <NutritionalTracker />
    </div>
  );
}

export default AddRecipe;
