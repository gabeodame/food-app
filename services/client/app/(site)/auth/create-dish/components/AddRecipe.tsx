import NewRecipeForm from "../forms/NewRecipeForm";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

function AddRecipe({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { recipeId } = searchParams as { recipeId: string };

  console.log("recipedId", recipeId);
  return (
    <div className="w-full flex gap-4 ">
      <NewRecipeForm recipeId={recipeId} />
    </div>
  );
}

export default AddRecipe;
