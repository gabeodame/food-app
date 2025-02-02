import { lazy } from "react";
import CustomDialog from "@/components/widgets/CustomDialog";
import NutritionalTracker from "./components/NutritionalTracker";
import IngredientForm from "./forms/IngredientForm";
import NewRecipeForm from "./forms/NewRecipeForm";
import AddRecipe from "./components/AddRecipe";
import { getUserRecipes } from "../actions/getUserRecipes";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export default async function RecipeHome({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const myRecipes = await getUserRecipes();

  return (
    <div className="w-full h-screen flex flex-col  md:container md:mx-auto p-4">
      <AddRecipe />
    </div>
  );
}
