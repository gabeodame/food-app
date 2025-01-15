import { lazy } from "react";
import CustomDialog from "@/components/widgets/CustomDialog";
import NutritionalTracker from "./components/NutritionalTracker";
import IngredientForm from "./forms/IngredientForm";
import NewRecipeForm from "./forms/NewRecipeForm";
import AddRecipe from "./components/AddRecipe";

export default function RecipeHome() {
  return (
    <div className="w-full h-screen flex flex-col  md:container md:mx-auto p-4">
      <AddRecipe />
    </div>
  );
}
